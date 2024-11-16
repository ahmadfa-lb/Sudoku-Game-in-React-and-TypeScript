import React from 'react';
import './BoxResult.css';
import lostGif from '../../assets/lost.gif';
import victoryGif from '../../assets/victory.gif';

interface BoxResultProps {
  resetGame: () => void;
  gameResult: 'win' | 'lose';
  
setEnteredCells: React.Dispatch<React.SetStateAction<{
  row: number;
  col: number;
  status: "valid" | "invalid";
}[]>>;
setEnteredCellStatus: React.Dispatch<React.SetStateAction<{
  row: number;
  col: number;
  status: "valid" | "invalid";
} | null>>;
setFocusedCell: (cell: {
  row: number;
  col: number;
} | null) => void
}

const BoxResult: React.FC<BoxResultProps> = ({ resetGame, gameResult, setEnteredCells, setFocusedCell, setEnteredCellStatus }) => {

  const handlePlayAgain = () => {
    setFocusedCell(null);
    resetGame();
    setEnteredCells([]);
    setEnteredCellStatus(null);
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

