
import React, { createContext, useReducer, ReactNode, useContext } from 'react';

type GameState = {
  theme: 'numbers' | 'icons';
  players: number;
  gridSize: '4x4' | '6x6';
  currentTurn: number;
  scores: number[];
  isStarted: boolean;
  moves: number[];
};

type GameAction =
  | { type: 'SET_THEME'; theme: 'numbers' | 'icons' }
  | { type: 'SET_PLAYERS'; players: number }
  | { type: 'SET_GRID_SIZE'; gridSize: '4x4' | '6x6' }
  | { type: 'SET_SCORE'; player: number; score: number }
  | { type: 'NEXT_TURN' }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'INCREMENT_MOVES' }
  | { type: 'RESET_MOVES' };

const initialState: GameState = {
  theme: 'numbers',
  players: 1,
  gridSize: '4x4',
  currentTurn: 0,
  scores: [0, 0, 0, 0],
  isStarted: false,
  moves: [0, 0, 0, 0],
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<GameAction> }>({
  state: initialState,
  dispatch: () => undefined,
});

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_PLAYERS':
      return { ...state, players: action.players, scores: Array(action.players).fill(0) };
    case 'SET_GRID_SIZE':
      return { ...state, gridSize: action.gridSize };
    case 'SET_SCORE': {
      const newScores = [...state.scores];
      newScores[action.player] = action.score;
      return { ...state, scores: newScores };
    }
    case 'NEXT_TURN':
      return { ...state, currentTurn: (state.currentTurn + 1) % state.players };
    case 'START_GAME':
      return { ...state, isStarted: true };
    case 'RESET_GAME':
      return { ...initialState, isStarted: false };

    case 'INCREMENT_MOVES': {
      const newMoves = [...state.moves];
      newMoves[state.currentTurn] = newMoves[state.currentTurn] + 1;
      return { ...state, moves: newMoves };
    }
    case 'RESET_MOVES':
      return { ...state, moves: Array(state.players).fill(0) };
    default:
      return state;
  }
};

const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

const useGameContext = () => useContext(GameContext);

export { GameProvider, useGameContext, GameContext };

