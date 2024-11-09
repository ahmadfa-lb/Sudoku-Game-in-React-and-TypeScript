import React from 'react';
import '../index.css'
import lostGif from '../assets/lost.gif';


interface BoxResultProps {
    resetGame: () => void; // Accept resetGame as a prop
  }

  const BoxResult: React.FC<BoxResultProps> = ({ resetGame }) => {
    return (
      <div className="game-modal show">
        <div className="content">
          <img src={lostGif} alt="Game over" />
          <button className="play-again" onClick={resetGame}>Play Again</button>
        </div>
      </div>
    );
  };

export default BoxResult;
