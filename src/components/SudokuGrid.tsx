// SudokuGrid.tsx
import React, { useEffect } from 'react';
import '../index.css'; // Your specific styles

// interface SudokuGridProps {
//   focusedCell: { row: number; col: number } | null;
//   setFocusedCell: (cell: { row: number; col: number } | null) => void;
//   selectedNumber: string;
//   grid: string[][];
//   setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
// }

// const SudokuGrid: React.FC<SudokuGridProps> = ({
//   focusedCell,
//   setFocusedCell,
//   selectedNumber,
//   grid,
//   setGrid
// }) => {
  
//   useEffect(() => {
//     if (focusedCell && selectedNumber) {
//       const { row, col } = focusedCell;
//       const newGrid = grid.map((r, i) =>
//         r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
//       );
//       setGrid(newGrid);
//     }
//   }, [selectedNumber, focusedCell, grid, setGrid]);

//   const handleCellClick = (row: number, col: number) => {
//     setFocusedCell({ row, col });
//   };

//   return (
//     <div className="sudoku-container">
//       {grid.map((row, i) =>
//         row.map((cell, j) => (
//           <input
//             key={`${i}-${j}`}
//             value={cell}
//             onClick={() => handleCellClick(i, j)}
//             readOnly
//             className={`sudoku-cell ${focusedCell?.row === i && focusedCell?.col === j ? 'focused' : ''}
//               ${i % 3 === 0 ? 'border-top' : ''}
//               ${j % 3 === 0 ? 'border-left' : ''}
//               ${j === 8 ? 'border-right' : ''}
//               ${i === 8 ? 'border-bottom' : ''}`}
//           />
//         ))
//       )}
//     </div>
//   );
// };



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
  setGrid
}) => {
  
  useEffect(() => {
    if (focusedCell && selectedNumber) {
      const { row, col } = focusedCell;
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
      );
      setGrid(newGrid);
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