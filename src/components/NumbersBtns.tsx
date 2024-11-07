import React, { useState } from 'react';
import '../index.css';

const NumbersBtns: React.FC = () => {
    
    const [grid, setGrid] = useState(Array(9).fill(Array(9).fill('')));
const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

    const handleNumberClick = (number: string) => {
        // setCurrentNumber(number);
        if (focusedCell) {
          const { row, col } = focusedCell;
          const newGrid = grid.map((r, i) =>
            r.map((cell, j) => (i === row && j === col ? number : cell))
          );
          setGrid(newGrid);
        }
      };

  return (
    <div className="number-buttons">
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleNumberClick((index + 1).toString())}
            className="number-button"
          >
            {index + 1}
          </button>
        ))}
      </div>
  );
};

export default NumbersBtns;
