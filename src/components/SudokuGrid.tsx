import { useState } from 'react';
import React, { useEffect } from 'react';
import '../index.css'; // Your specific styles
import { isValidSudoku } from '../validation';
interface SudokuGridProps {
  focusedCell: { row: number; col: number } | null;
  setFocusedCell: (cell: { row: number; col: number } | null) => void;
  selectedNumber: string;
  grid: string[][];
  setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  focusedCell,
  setFocusedCell,
  selectedNumber,
  grid,
  setGrid,
  setSelectedNumber,
}) => {

  const [conflictCells, setConflictCells] = useState<{ row: number; col: number }[]>([]);

  
  // useEffect(() => {
  //   if (focusedCell && selectedNumber) {
  //     const { row, col } = focusedCell;
  //     const newGrid = grid.map((r, i) =>
  //       r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
  //     );
  
  //     if (isValidSudoku(newGrid)) {
  //       setGrid(newGrid);
  //       setSelectedNumber('');
  //     } else {
  //       // Highlight the conflict
  //       setFocusedCell(null); // Optionally clear focus if it's an invalid move
  //     }
  //   }
  // }, [selectedNumber, focusedCell, grid, setGrid]);

  useEffect(() => {
    if (focusedCell && selectedNumber) {
      const { row, col } = focusedCell;
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
      );
  
      if (isValidSudoku(newGrid)) {
        setGrid(newGrid);
        setSelectedNumber('');
        setConflictCells([]); // Clear conflicts if valid
      } else {
        // Identify conflicting cells
        const newConflictCells = [];
  
        // Check for conflicts in the current row, column, and 3x3 grid
        for (let i = 0; i < 9; i++) {
          if (grid[row][i] === selectedNumber && i !== col) newConflictCells.push({ row, col: i });
          if (grid[i][col] === selectedNumber && i !== row) newConflictCells.push({ row: i, col });
        }
  
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
  
        setConflictCells(newConflictCells);
        setFocusedCell(null); // Optionally clear focus if it's an invalid move
      }
    }
  }, [selectedNumber, focusedCell, grid, setGrid]);

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



  const isConflicting = (row: number, col: number, grid: string[][]): boolean => {
    const cellValue = grid[row][col];
    if (cellValue === '') return false;
  
    // Check row conflict
    for (let j = 0; j < 9; j++) {
      if (j !== col && grid[row][j] === cellValue) {
        return true;
      }
    }
  
    // Check column conflict
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === cellValue) {
        return true;
      }
    }
  
    // Check 3x3 subgrid conflict
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const subgridRow = startRow + i;
        const subgridCol = startCol + j;
        if (
          (subgridRow !== row || subgridCol !== col) &&
          grid[subgridRow][subgridCol] === cellValue
        ) {
          return true;
        }
      }
    }
  
    return false;
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