
import {useGameContext} from "../../contexts/GameContext.tsx";

const Settings = () => {
  const {state, dispatch} = useGameContext();

  const handleThemeChange = (theme: 'numbers' | 'icons') => {
    dispatch({type: 'SET_THEME', theme});
  };

  const handlePlayersChange = (players: number) => {
    dispatch({type: 'SET_PLAYERS', players});
  };

  const handleGridSizeChange = (gridSize: '4x4' | '6x6') => {
    dispatch({type: 'SET_GRID_SIZE', gridSize});
  };

  const handleStartGame = () => {
    dispatch({type: 'START_GAME'});
  };

  return (
    <div className='settings'>
      <h2 className='setting-title'>memory</h2>
      <div className="setting-options">
        <div className='setting-item'>
          <label className='setting-item_title'>Select Theme</label>
          <div className="buttons-wrapper">
            <button onClick={() => handleThemeChange('numbers')}
                    className={state.theme === 'numbers' ? 'active' : ''}>Numbers
            </button>
            <button onClick={() => handleThemeChange('icons')}
                    className={state.theme === 'icons' ? 'active' : ''}>Icons
            </button>
          </div>
        </div>
        <div className='setting-item'>
          <label className='setting-item_title'>Numbers of Players</label>
          <div className="buttons-wrapper">
            {[1, 2, 3, 4].map((num) => (
              <button key={num} onClick={() => handlePlayersChange(num)}
                      className={state.players === num ? 'active' : ''}>{num}</button>
            ))}
          </div>
        </div>
        <div className='setting-item'>
          <label className='setting-item_title'>Grid Size</label>
          <div className="buttons-wrapper">
            <button onClick={() => handleGridSizeChange('4x4')} className={state.gridSize === '4x4' ? 'active' : ''}>4x4
            </button>
            <button onClick={() => handleGridSizeChange('6x6')} className={state.gridSize === '6x6' ? 'active' : ''}>6x6
            </button>
          </div>
        </div>
        <button className='start-button' onClick={handleStartGame}>Start Game</button>
      </div>

    </div>
  );
};

export default Settings;



