import React from 'react';
import './BoxResult.css';
import lostGif from '../../assets/lost.gif';
import victoryGif from '../../assets/victory.gif';

interface BoxResultProps {
  resetGame: () => void;
  gameResult: 'win' | 'lose';
  currentDifficulty: string;
}

const BoxResult: React.FC<BoxResultProps> = ({ resetGame, gameResult, currentDifficulty }) => {

  const handlePlayAgain = () => {
    resetGame(currentDifficulty);
  };

  return (
    <div className="game-modal show">
      <div className="content">
        <img 
          src={gameResult === 'win' ? victoryGif : lostGif} 
          alt={gameResult === 'win' ? 'Victory' : 'Game Over'} 
        />
        <button className="play-again" onClick={handlePlayAgain}>Play Again</button>
      </div>
    </div>
  );
};

export default BoxResult;
