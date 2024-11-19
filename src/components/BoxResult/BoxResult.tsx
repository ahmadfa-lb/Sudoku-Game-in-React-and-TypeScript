import React, { useEffect, useState } from 'react';
import './BoxResult.css';
import lostGif from '../../assets/lost.gif';
import victoryGif from '../../assets/victory.gif';

interface BoxResultProps {
  resetGame: () => void;
  gameResult: 'win' | 'lose';
}

const BoxResult: React.FC<BoxResultProps> = ({ resetGame, gameResult }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [gameResult]);

  const handlePlayAgain = () => {
    resetGame();
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="game-modal show">
          <div className="content">
            <img 
              src={gameResult === 'win' ? victoryGif : lostGif} 
              alt={gameResult === 'win' ? 'Victory' : 'Game Over'} 
            />
            <button className="play-again" onClick={handlePlayAgain}>Play Again</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BoxResult;
