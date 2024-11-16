import React, { useEffect } from "react";
import "./SudokuGrid.css";
import { isValidSudoku } from "../../TypeScript/validation";

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
  cellRefs: React.RefObject<(HTMLInputElement | null)[][]>;
  highlightedCells: { row: number; col: number; color: "focused" | "conflict" }[];
  setHighlightedCells: React.Dispatch<
    React.SetStateAction<
      { row: number; col: number; color: "focused" | "conflict" }[]
    >
  >;
  enteredCells: {
    row: number;
    col: number;
    status: "valid" | "invalid";
}[];
setEnteredCells: React.Dispatch<React.SetStateAction<{
  row: number;
  col: number;
  status: "valid" | "invalid";
}[]>>;
enteredCellStatus: {
  row: number;
  col: number;
  status: "valid" | "invalid";
} | null;
setEnteredCellStatus: React.Dispatch<React.SetStateAction<{
  row: number;
  col: number;
  status: "valid" | "invalid";
} | null>>;
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
  setResetConflictCells,
  cellRefs,
  highlightedCells,
  setHighlightedCells,
  enteredCells,
  setEnteredCells,
  enteredCellStatus,
  setEnteredCellStatus,
}) => {

  useEffect(() => {
    setResetConflictCells(() => () => setHighlightedCells([]));
  }, [setResetConflictCells]);

  useEffect(() => {
    if (focusedCell && selectedNumber) {
      const { row, col } = focusedCell;

      // Temporarily update the grid with the new number
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? selectedNumber : cell))
      );

      // Check validity of the entered number
      const isValid = isValidSudoku(newGrid, row, col);

      if (isValid) {
        setEnteredCellStatus({ row, col, status: "valid" });
        setGrid(newGrid);
        setEnteredCells((prev) => [
          ...prev.filter((c) => !(c.row === row && c.col === col)),
          { row, col, status: "valid" },
        ]);
      } else {
        setEnteredCellStatus({ row, col, status: "invalid" });
        setGrid(newGrid);
        setSelectedNumber("");
        setEnteredCells((prev) => [
          ...prev.filter((c) => !(c.row === row && c.col === col)),
          { row, col, status: "invalid" },
        ]);

        setMistakes((prev) => {
          const newMistakeCount = prev + 1;
          if (newMistakeCount >= maxMistakes) {
            setGameOver(true);
          }
          return newMistakeCount;
        });
      }

      // Highlight cells with the same value
      const relatedCells: {
        row: number;
        col: number;
        color: "focused" | "conflict";
      }[] = [];
      newGrid.forEach((r, i) => {
        r.forEach((cell, j) => {
          if (cell === selectedNumber) {
            // Check if this cell is conflicting with the focusedCell
            const inSameRow = i === row;
            const inSameCol = j === col;
            const inSameSubgrid =
              Math.floor(i / 3) === Math.floor(row / 3) &&
              Math.floor(j / 3) === Math.floor(col / 3);

            const isConflict = inSameRow || inSameCol || inSameSubgrid;

            relatedCells.push({
              row: i,
              col: j,
              color: isConflict ? "conflict" : "focused",
            });
          }
        });
      });

      setHighlightedCells(relatedCells);
      setSelectedNumber("");
    }
  }, [focusedCell, selectedNumber, grid, setGrid, setMistakes, setGameOver]);

  const handleCellClick = (row: number, col: number) => {
    setFocusedCell({ row, col });
    const clickedValue = grid[row][col];

    if (!clickedValue) {
      setHighlightedCells([]);
      return;
    }

    const relatedCells: {
      row: number;
      col: number;
      color: "focused" | "conflict";
    }[] = [];
    grid.forEach((r, i) => {
      r.forEach((cell, j) => {
        if (cell === clickedValue) {
          const tempGrid = grid.map((r2, i2) =>
            r2.map((cell2, j2) => (i2 === i && j2 === j ? "" : cell2))
          );
          const isConflict = !isValidSudoku(tempGrid, i, j);
          relatedCells.push({
            row: i,
            col: j,
            color: isConflict ? "conflict" : "focused",
          });
        }
      });
    });

    setHighlightedCells(relatedCells);
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
        row.map((cell, j) => {
          const highlight = highlightedCells.find(
            (c) => c.row === i && c.col === j
          );
          const isFocusedCell =
            enteredCellStatus?.row === i && enteredCellStatus?.col === j;

          const cellClass = isFocusedCell
            ? enteredCellStatus.status
            : highlight?.color || "";

          const enteredCell = enteredCells.find(
            (c) => c.row === i && c.col === j
          );

          const highlighted = highlightedCells.find(
            (c) => c.row === i && c.col === j
          );
          const cellClass1 = enteredCell
            ? enteredCell.status
            : highlighted?.color || "";

          const isFocused = focusedCell?.row === i && focusedCell?.col === j;

          return (
            <input
              title="🤔🧩🔢"
              key={`${i}-${j}`}
              ref={(el) => {
                if (cellRefs.current) {
                  cellRefs.current[i][j] = el;
                }
              }}
              value={cell}
              onClick={() => handleCellClick(i, j)}
              readOnly
              className={`sudoku-cell ${cellClass}  ${cellClass1}
                ${isHighlighted(i, j) ? "highlighted" : ""}
                ${i % 3 === 0 ? "border-top" : ""}
                ${j % 3 === 0 ? "border-left" : ""}
                ${j === 8 ? "border-right" : ""}
                ${i === 8 ? "border-bottom" : ""}
                ${isFocused ? "focused" : ""}`}
            />
          );
        })
      )}
    </div>
  );
};

export default SudokuGrid;
