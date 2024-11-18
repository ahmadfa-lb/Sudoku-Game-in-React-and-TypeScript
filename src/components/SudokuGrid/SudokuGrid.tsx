import React, { useEffect } from "react";
import "./SudokuGrid.css";
import { isValidSudoku } from "../../TypeScript/validation";
import { Cell } from "../../App";

interface SudokuGridProps {
  focusedCell: { row: number; col: number } | null;
  setFocusedCell: (cell: { row: number; col: number } | null) => void;
  selectedNumber: string;
  grid: Cell[][]; // Use Cell[][] instead of string[][]
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>; // Set grid as Cell[][]
  setMistakes: React.Dispatch<React.SetStateAction<number>>;
  mistakes: number;
  maxMistakes: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<string>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setResetConflictCells: React.Dispatch<React.SetStateAction<() => void>>;
  cellRefs: React.RefObject<(HTMLInputElement | null)[][]>;
  highlightedCells: {
    row: number;
    col: number;
    color: "focused" | "conflict";
  }[];
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
  setEnteredCells: React.Dispatch<
    React.SetStateAction<
      {
        row: number;
        col: number;
        status: "valid" | "invalid";
      }[]
    >
  >;
  enteredCellStatus: {
    row: number;
    col: number;
    status: "valid" | "invalid";
  } | null;
  setEnteredCellStatus: React.Dispatch<
    React.SetStateAction<{
      row: number;
      col: number;
      status: "valid" | "invalid";
    } | null>
  >;
  readOnlyCells: {
    row: number;
    col: number;
  }[];
  setReadOnlyCells: React.Dispatch<
    React.SetStateAction<
      {
        row: number;
        col: number;
      }[]
    >
  >;
  userEditableCells: {
    row: number;
    col: number;
  }[];
  setUserEditableCells: React.Dispatch<
    React.SetStateAction<
      {
        row: number;
        col: number;
      }[]
    >
  >;
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

  const isReadOnly = (row: number, col: number) => grid[row][col].readOnly;

  useEffect(() => {
    if (focusedCell && selectedNumber) {
      const { row, col } = focusedCell;

      if (isReadOnly(row, col)) {
        setSelectedNumber("");
        return;
      }

      // Ensure you're setting a Cell object with a value instead of just a string.
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) =>
          i === row && j === col ? { ...cell, value: selectedNumber } : cell
        )
      );

      const isValid = isValidSudoku(newGrid as Cell[][], row, col); // Cast grid to Cell[][] here

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

      const relatedCells: {
        row: number;
        col: number;
        color: "focused" | "conflict";
      }[] = [];
      newGrid.forEach((r, i) => {
        r.forEach((cell, j) => {
          if (cell.value === selectedNumber) {
            // Make sure you're comparing `value`, not the entire Cell object.
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

  const handleCellClick = (row: number, col: number) => {
    setHighlightedCells([]);
    const clickedValue = grid[row][col].value; // Access the value of the cell

    // Allow focusing regardless of editability
    setFocusedCell({ row, col });

    if (isReadOnly(row, col)) {
      // Highlight related cells and the column/row/subgrid for read-only cells
      if (clickedValue) {
        const relatedCells: {
          row: number;
          col: number;
          color: "focused" | "conflict";
        }[] = [];

        grid.forEach((r, i) => {
          r.forEach((cell, j) => {
            if (cell.value === clickedValue) {
              // Ensure we're comparing the value of the cell
              // Create a new tempGrid with Cell objects instead of strings
              const tempGrid = grid.map((r2, i2) =>
                r2.map(
                  (cell2, j2) =>
                    i2 === i && j2 === j ? { ...cell2, value: "" } : cell2 // Reset value, not replacing with string
                )
              );
              const isConflict = !isValidSudoku(tempGrid as Cell[][], i, j); // Cast to Cell[][] as needed
              relatedCells.push({
                row: i,
                col: j,
                color: isConflict ? "conflict" : "focused",
              });
            }
          });
        });
        setHighlightedCells(relatedCells);
      }
      return; // Prevent editing on read-only cells
    }

    // Allow edits only for editable cells
    setFocusedCell({ row, col });
  };

  return (
    <div className="sudoku-container">
      {grid.map((row, i) =>
        row.map((cell, j) => {
          const isCellReadOnly = isReadOnly(i, j);
          const isFocused = focusedCell?.row === i && focusedCell?.col === j;
          // const highlight = highlightedCells.find(
          //   (c) => c.row === i && c.col === j
          // );

          // const cellClass = highlight?.color || "";
          // ${cellClass}

          const enteredCell = enteredCells.find(
            (c) => c.row === i && c.col === j
          );

          const highlighted = highlightedCells.find(
            (c) => c.row === i && c.col === j
          );
          const cellClass1 = enteredCell
            ? enteredCell.status
            : highlighted?.color || "";

          const highlight = highlightedCells.find(
            (c) => c.row === i && c.col === j
          );
          const isFocusedCell =
            enteredCellStatus?.row === i && enteredCellStatus?.col === j;

          const cellClass2 = isFocusedCell
            ? enteredCellStatus.status
            : highlight?.color || "";

          return (
            <input
              title="🤔🧩🔢"
              inputMode="none"
              key={`${i}-${j}`}
              ref={(el) => {
                if (cellRefs.current) {
                  cellRefs.current[i][j] = el;
                }
              }}
              value={cell.value}
              onClick={() => handleCellClick(i, j)} // Focus and highlight logic
              readOnly={isCellReadOnly} // Block edits for read-only cells
              className={`sudoku-cell ${cellClass1} ${cellClass2}
                ${cell.status === "valid" ? "valid-cell" : ""} 
                ${cell.status === "invalid" ? "invalid-cell" : ""} 
                ${isHighlighted(i, j) ? "highlighted" : ""} 
                ${isFocused ? "focused" : ""} 
                ${i % 3 === 0 ? "border-top" : ""} 
                ${j % 3 === 0 ? "border-left" : ""} 
                ${j === 8 ? "border-right" : ""} 
                ${i === 8 ? "border-bottom" : ""}`}
            />
          );
        })
      )}
    </div>
  );
};

export default SudokuGrid;
