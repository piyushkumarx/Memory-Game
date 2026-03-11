import React from "react";
import {useGameContext} from "./contexts/GameContext.tsx";
import Settings from "./components/Settings";
import Board from "./components/Board";
import "./reset.css"
import './App.css'

function App() {
  const {state} = useGameContext();
  const bgColor = state.isStarted ? 'var(--white-100)' : 'var(--blue-500)';


  return (
    <div className={`app ${state.isStarted ? "isStarted" : ""}`} style={{'--bg': bgColor} as React.CSSProperties}>
      <div className="app-wrapper">
        {state.isStarted ? <Board/> : <Settings/>}
        
      </div>
    </div>
  )
}

export default App
