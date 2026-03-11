
import React, { useState, useEffect } from 'react';
import Card from '../Card';
import { useGameContext } from '../../contexts/GameContext';
import icons from "../../icons.tsx";
import Modal from "../Modal";


const generateCards = (gridSize: '4x4' | '6x6', theme: 'numbers' | 'icons') => {
  const totalCards = gridSize === '4x4' ? 16 : 36;
  let values: (number | string)[] = Array.from({ length: totalCards / 2 }, (_, i) => i);

  if (theme === 'icons') {
    values = icons.slice(0, totalCards / 2).map((icon) => icon.url);
  }

  const cards = [...values, ...values];

  return cards.sort(() => Math.random() - 0.5);
};


const Board: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [cards, setCards] = useState<(number | string)[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
  const [highlightCards, setHighlightCards] = useState<number[]>([]);
  const [isUsersFinished, setIsUsersFinished] = useState<boolean>(false);
  const [isTie, setIsTie] = useState<boolean>(false);
  const [winnerIndices, setWinnerIndices] = useState<number[]>([]);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const isMobile = innerWidth < 768;


  // useEffect(() => {
  //   console.log(`Timer useEffect: state.players=${state.players}, state.isStarted=${state.isStarted}`);
  //
  //   if (state.players === 1 && state.isStarted) {
  //     timerRef.current = setInterval(() => {
  //       setTime(prevTime => prevTime + 1);
  //     }, 1000);
  //     console.log('Timer started');
  //   } else {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //       timerRef.current = null;
  //       console.log('Timer cleared');
  //     }
  //   }
  //
  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //       timerRef.current = null;
  //       console.log('Timer cleared on cleanup');
  //     }
  //   };
  // }, [state.players, state.isStarted,state]);


  useEffect(() => {

    let timer: NodeJS.Timeout;
    if (state.players === 1 && state.isStarted) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [state.players, state.isStarted]);


  useEffect(() => {
    setCards(generateCards(state.gridSize, state.theme));
    setRevealedCards([]);
    setMatchedCards(new Set());
    setHighlightCards([]);
    setIsUsersFinished(false);
    setIsTie(false);
    setTime(0);
  }, [state.isStarted, state.gridSize, state.theme]);

  useEffect(() => {
    if (state.isStarted && matchedCards.size === cards.length && matchedCards.size !== 0) {
      setIsUsersFinished(true);
      setFinalTime(time);
    }
  }, [matchedCards, cards.length, state.isStarted]);

  useEffect(() => {
    if (matchedCards.size === cards.length) {
      setFinalTime(time);
    }
  }, [matchedCards]);


  useEffect(() => {
    const maxScore = Math.max(...state.scores);
    const winnerIndices = state.scores
      .map((score, index) => ({ score, index }))
      .filter(({ score }) => score === maxScore)
      .map(({ index }) => index);

    setIsTie(winnerIndices.length > 1);
    setWinnerIndices(winnerIndices);
  }, [state.scores]);

  const handleCardClick = (index: number) => {
    if (revealedCards.length === 2 || revealedCards.includes(index)) return;

    setRevealedCards((prev) => [...prev, index]);
    setHighlightCards((prev) => [...prev, index]);

    if (revealedCards.length === 1) {
      const firstIndex = revealedCards[0];
      if (cards[firstIndex] === cards[index]) {
        setMatchedCards((prev) => new Set(prev).add(firstIndex).add(index));
        dispatch({ type: 'SET_SCORE', player: state.currentTurn, score: state.scores[state.currentTurn] + 1 });
        dispatch({ type: 'INCREMENT_MOVES' });
        setTimeout(() => {
          setRevealedCards([]);
          setHighlightCards([]);
        }, 700);
      } else {
        setTimeout(() => {
          setRevealedCards([]);
          setHighlightCards([]);
          dispatch({ type: 'NEXT_TURN' });
          dispatch({ type: 'INCREMENT_MOVES' });
        }, 700);
      }
    }
  };

  return (
    <div className={`board-wrapper`}>
      <div className="board-header">
        <h2>Memory Game</h2>
        <div className="buttons-wrapper">
          <button onClick={() => {
            setMatchedCards(new Set());
            setCards(cards => cards.sort(() => Math.random() - 0.5));
          }} className='restart'>Restart
          </button>
          <button onClick={() => dispatch({ type: 'RESET_GAME' })} className='new_game'>New Game</button>
        </div>
        {isMobile && <button className='menu' onClick={() => setIsMenuOpened(true)}>Menu</button>}
      </div>
      
      <div className={`board has-${state.gridSize}`}>
        {cards.map((card, index) => (
          <Card
            key={index}
            value={card}
            isRevealed={revealedCards.includes(index) || matchedCards.has(index)}
            highlight={highlightCards.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}

      </div>
      {state.players > 1 && (
        <div className="players">
          {state.scores.slice(0, state.players).map((score, index) => (
            <div key={index} className={`player ${state.currentTurn === index ? 'current' : ''}`}>
              <span className='player-index'>{isMobile ? "P" : "Player"}{index + 1}</span>
              <span className='player-score'>{score}</span>
            </div>
          ))}
        </div>
      )}

      {state.players === 1 && (
        <div className="game-info">
          <div className="time"><span className='title'>Time</span> <span
            className='value'>{Math.floor((isUsersFinished ? finalTime : time) / 60)}:{String((isUsersFinished ? finalTime : time) % 60).padStart(2, '0')}</span>
          </div>
          <div className="moves"><span className='title'>Moves</span> <span className='value'>{state.moves[0]}</span>
          </div>
        </div>
      )}
      <Modal isOpen={isUsersFinished && state.isStarted && matchedCards.size === cards.length}
        onClose={() => setIsUsersFinished(false)}>
        {state.players > 1 ? <>
          <div className='winner'>
            <h4>{isTie ? "It's a tie!" : `Player ${winnerIndices[0] + 1} wins!`}</h4>
          </div>
          <p className='modal-description'>Game over! Here are the results…</p>
          <div className="results">
            {state.scores.slice(0, state.players).map((score, index) => (
              <div key={index} className={`player-result ${winnerIndices.includes(index) ? 'winner-player' : ''}`}>
                <span className='player-index'>Player {index + 1}
                  <strong>{winnerIndices.includes(index) ? "(Winner!)" : ""}</strong></span>
                <span className='player-score'>{2 * score} Pairs</span>
              </div>
            ))}
          </div>
          <div className="modal-buttons">
            <button
              onClick={() => {
                setMatchedCards(new Set());
                setCards((cards) => cards.sort(() => Math.random() - 0.5));
                setIsUsersFinished(false);
                setIsTie(false);
                setTime(0);
              }}
              className='restart'
            >
              Restart
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'RESET_GAME' });
                setIsUsersFinished(false);
                setIsTie(false);
                setTime(0);
              }}
              className='new_game'
            >
              New Game
            </button>
          </div>
        </> :
          <div className={'game-info-modal'}>
            <h2 className='modal-title'>You did it!</h2>
            <p className='modal-description'>Game over! Here’s how you got on…</p>
            <div className="game-info">
              <div className="time"><span className='title'>Time</span> <span
                className='value'>{Math.floor((isUsersFinished ? finalTime : time) / 60)}:{String((isUsersFinished ? finalTime : time) % 60).padStart(2, '0')}</span>
              </div>
              <div className="moves"><span className='title'>Moves</span> <span
                className='value'>{state.moves[0]}</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button
                onClick={() => {
                  setMatchedCards(new Set());
                  setCards((cards) => cards.sort(() => Math.random() - 0.5));
                  setIsUsersFinished(false);
                  setIsTie(false);
                  setTime(0);
                }}
                className='restart'
              >
                Restart
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'RESET_GAME' });
                  setIsUsersFinished(false);
                  setIsTie(false);
                  setTime(0);
                }}
                className='new_game'
              >
                Setup New Game
              </button>
            </div>
          </div>}


      </Modal>
      <Modal isOpen={isMenuOpened} onClose={() => setIsMenuOpened(false)}>
        <div className="menu-buttons">
          <button onClick={() => dispatch({ type: "RESET_GAME" })} className="restart">Restart</button>
          <button onClick={() => {
            dispatch({ type: "START_GAME" });
            setIsMenuOpened(false)
          }} className="new_game">New Game
          </button>
          <button onClick={() => setIsMenuOpened(false)} className="resume_game">Resume game</button>
        </div>
      </Modal>

    </div>
  );
};

export default Board;
