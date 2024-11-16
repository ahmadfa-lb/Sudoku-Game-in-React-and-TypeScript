
import React, { useEffect } from 'react';
import './SudokuGrid.css';
import { isValidSudoku } from '../../TypeScript/validation';

interface SudokuGridProps {
  focusedCell: { row: number; col: number } | null;
  setFocusedCell: (cell: { row: number; col: number } | null) => void;
  selectedNumber: string;
  grid: string[][];
  setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
  setMistakes: React.Dispatch<React.SetStateAction<number>>;
  mistakes: number;
  maxMistakes: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<string>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setResetConflictCells: React.Dispatch<React.SetStateAction<() => void>>;
  conflictCells: { row: number; col: number; color: 'conflict' | 'valid' }[];
  setConflictCells: React.Dispatch<React.SetStateAction<{ row: number; col: number; color: 'conflict' | 'valid' }[]>>;
  cellRefs: React.RefObject<(HTMLInputElement | null)[][]>;
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
  setGameOver,
  conflictCells,
  setConflictCells,
  setResetConflictCells,
  cellRefs,
}) => {
  // const [conflictCells, setConflictCells] = useState<{ row: number; col: number }[]>([]);
  //const [mistakenNumber, setMistakenNumber] = useState<string | null>(null); // Track mistaken number

  useEffect(() => {
    setResetConflictCells(() => () => setConflictCells([]));
  }, [setResetConflictCells]);

  // useEffect(() => {
  //   // Ensure refs array exists for each row
  //   if (cellRefs.current.length === 0) {
  //     cellRefs.current = Array.from({ length: 9 }, () =>
  //       Array.from({ length: 9 }, () => null)
  //     );
  //   }
  // }, [cellRefs]);


  // useEffect(() => {
  //   if (focusedCell && selectedNumber) {
  //     const { row, col } = focusedCell;
  
  //     // Temporarily update the grid with the new number
  //     const newGrid = grid.map((r, i) =>
  //       r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
  //     );
  
  //     // Check if the specific cell entry is valid
  //     if (isValidSudoku(newGrid, row, col)) {
  //       setGrid(newGrid);
  //       setSelectedNumber('');
  //       setMistakenNumber(null);
  
  //       // Add a "valid" entry in conflictCells for styling in blue
  //       setConflictCells((prev) => [
  //         ...prev.filter(c => !(c.row === row && c.col === col)), // Remove any previous conflicts at this cell
  //         { row, col, color: 'valid' }  // Add the new valid entry
  //       ]);
  
  //     } else {
  //       setGrid(newGrid);
  //       setSelectedNumber('');
  //       setMistakenNumber(selectedNumber);
  
  //       setConflictCells((prev) => [
  //         ...prev.filter(c => !(c.row === row && c.col === col)),
  //         { row, col, color: 'conflict' } 
  //       ]);
  
  //       setMistakes((prev) => {
  //         const newMistakeCount = prev + 1;
  //         if (newMistakeCount >= maxMistakes) {
  //           setGameOver(true);
  //         }
  //         return newMistakeCount;
  //       });
  //     }
  //   }
  // }, [selectedNumber, focusedCell, grid, setGrid, setSelectedNumber, setMistakes, maxMistakes, setGameOver]);
  

  useEffect(() => {
    if (focusedCell && selectedNumber) {
      const { row, col } = focusedCell;
    
      // Temporarily update the grid with the new number
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
      );
    
      // Check if the specific cell entry is valid
      if (isValidSudoku(newGrid, row, col)) {
        setGrid(newGrid);
        setSelectedNumber('');
        setConflictCells((prev) => [
          ...prev.filter(c => !(c.row === row && c.col === col)),
          { row, col, color: 'valid' }  // Add the new valid entry
        ]);
      } else {
        setGrid(newGrid);
        setSelectedNumber('');
        setConflictCells((prev) => [
          ...prev.filter(c => !(c.row === row && c.col === col)),
          { row, col, color: 'conflict' }
        ]);
        setMistakes((prev) => {
          const newMistakeCount = prev + 1;
          if (newMistakeCount >= maxMistakes) {
            setGameOver(true);
          }
          return newMistakeCount;
        });
      }
    }
  }, [selectedNumber, focusedCell, grid, setGrid, setSelectedNumber, setMistakes, maxMistakes, setGameOver, setConflictCells]);
  


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


// return (
//   <div className="sudoku-container">
//     {grid.map((row, i) =>
//       row.map((cell, j) => {
//         const conflict = conflictCells.find(c => c.row === i && c.col === j);
//         const cellClass = conflict
//           ? conflict.color === 'conflict' ? 'conflict' : 'valid'
//           : '';

//         return (
//           <input
//             key={`${i}-${j}`}
//             value={cell}
//             onClick={() => handleCellClick(i, j)}
//             readOnly
//             className={`sudoku-cell ${cellClass} 
//               ${focusedCell?.row === i && focusedCell?.col === j ? 'focused' : ''}
//               ${isHighlighted(i, j) ? 'highlighted' : ''}
//               ${i % 3 === 0 ? 'border-top' : ''}
//               ${j % 3 === 0 ? 'border-left' : ''}
//               ${j === 8 ? 'border-right' : ''}
//               ${i === 8 ? 'border-bottom' : ''}`}
//           />
//         );
//       })
//     )}
//   </div>
// );

return (
  <div className="sudoku-container">
    {grid.map((row, i) =>
      row.map((cell, j) => {
        const conflict = conflictCells.find(c => c.row === i && c.col === j);
        const cellClass = conflict
          ? conflict.color === 'conflict' ? 'conflict' : 'valid'
          : '';

        return (
          <input
            title='🤔'
            key={`${i}-${j}`}
            ref={(el) => {
              if (cellRefs.current) {
                cellRefs.current[i][j] = el;
              }
            }}
            value={cell}
            onClick={() => handleCellClick(i, j)}
            readOnly
            className={`sudoku-cell ${cellClass} 
              ${focusedCell?.row === i && focusedCell?.col === j ? 'focused' : ''}
              ${isHighlighted(i, j) ? 'highlighted' : ''}
              ${i % 3 === 0 ? 'border-top' : ''}
              ${j % 3 === 0 ? 'border-left' : ''}
              ${j === 8 ? 'border-right' : ''}
              ${i === 8 ? 'border-bottom' : ''}`}
          />
        );
      })
    )}
  </div>
);


};

export default SudokuGrid;
