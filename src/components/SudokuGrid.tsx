import React, { useState } from 'react';
import '../index.css';

const SudokuGrid: React.FC = () => {
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill('')));
//   const [currentNumber, setCurrentNumber] = useState<string>('');
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    setFocusedCell({ row, col });
  };

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
    <div>
      <div className="sudoku-container">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              value={cell}
              onClick={() => handleCellClick(i, j)}
              readOnly
              className={`sudoku-cell ${
                focusedCell?.row === i && focusedCell?.col === j ? 'focused' : ''
              }
                ${i % 3 === 0 ? 'border-top' : ''}
                ${j % 3 === 0 ? 'border-left' : ''}
                ${j === 8 ? 'border-right' : ''}
                ${i === 8 ? 'border-bottom' : ''}`}
            />
          ))
        )}
      </div>

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
    </div>
  );
};

export default SudokuGrid;
