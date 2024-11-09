import React, { useState, useEffect } from 'react';
import '../index.css'; // Your specific styles
import { isValidSudoku } from '../validation';

interface SudokuGridProps {
  focusedCell: { row: number; col: number } | null;
  setFocusedCell: (cell: { row: number; col: number } | null) => void;
  selectedNumber: string;
  grid: string[][];
  setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
  setMistakes: React.Dispatch<React.SetStateAction<number>>;
  maxMistakes: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<string>>;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  focusedCell,
  setFocusedCell,
  selectedNumber,
  grid,
  setGrid,
  setSelectedNumber,
  setMistakes,
  maxMistakes,
}) => {
  const [conflictCells, setConflictCells] = useState<{ row: number; col: number }[]>([]);
  const [mistakenNumber, setMistakenNumber] = useState<string | null>(null); // Track mistaken number

  useEffect(() => {
    if (focusedCell && selectedNumber) {
      const { row, col } = focusedCell;

      // Temporarily update the grid for validation
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
      );

      // Check if the updated grid is valid
      if (isValidSudoku(newGrid)) {
        setGrid(newGrid);
        setConflictCells([]);
        setSelectedNumber('');
        setMistakenNumber(null);
      } else {
        setGrid(newGrid);
        setSelectedNumber('');
        setMistakenNumber(selectedNumber);

        // Identify conflicting cells and all cells with the mistaken number
        const newConflictCells = [];
        for (let i = 0; i < 9; i++) {
          if (grid[row][i] === selectedNumber && i !== col) newConflictCells.push({ row, col: i });
          if (grid[i][col] === selectedNumber && i !== row) newConflictCells.push({ row: i, col });
        }

        // Check for conflicts in the 3x3 subgrid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const subgridRow = startRow + i;
            const subgridCol = startCol + j;
            if (
              grid[subgridRow][subgridCol] === selectedNumber &&
              (subgridRow !== row || subgridCol !== col)
            ) {
              newConflictCells.push({ row: subgridRow, col: subgridCol });
            }
          }
        }

        setConflictCells(newConflictCells); // Set cells with conflicts
        setMistakes(prev => {
          const newMistakeCount = prev + 1;
          if (newMistakeCount >= maxMistakes) {
            alert("Game over! You've reached the maximum mistakes.");
          }
          return newMistakeCount;
        });
      }
    }
  }, [selectedNumber, focusedCell, grid, setGrid, setSelectedNumber, setMistakes, maxMistakes]);

  const handleCellClick = (row: number, col: number) => {
    setFocusedCell({ row, col });
  };

  const isHighlighted = (row: number, col: number) => {
    if (!focusedCell) return false;
    const { row: focusedRow, col: focusedCol } = focusedCell;
    const inSameRow = row === focusedRow;
    const inSameCol = col === focusedCol;
    const inSameSubgrid =
      Math.floor(row / 3) === Math.floor(focusedRow / 3) &&
      Math.floor(col / 3) === Math.floor(focusedCol / 3);
    return inSameRow || inSameCol || inSameSubgrid;
  };

  return (
    <div className="sudoku-container">
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <input
            key={`${i}-${j}`}
            value={cell}
            onClick={() => handleCellClick(i, j)}
            readOnly
            className={`sudoku-cell 
              ${focusedCell?.row === i && focusedCell?.col === j ? 'focused' : ''}
              ${isHighlighted(i, j) ? 'highlighted' : ''}
              ${conflictCells.some(c => c.row === i && c.col === j) ? 'conflict' : ''}
              ${mistakenNumber && cell === mistakenNumber ? 'mistake-number' : ''}
              ${i % 3 === 0 ? 'border-top' : ''}
              ${j % 3 === 0 ? 'border-left' : ''}
              ${j === 8 ? 'border-right' : ''}
              ${i === 8 ? 'border-bottom' : ''}`}
          />
        ))
      )}
    </div>
  );
};

export default SudokuGrid;


