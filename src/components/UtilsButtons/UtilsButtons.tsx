import React from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./UtilsButtons.css";
import { isValidBoard } from "../../TypeScript/validation";
import { solveBoard } from "../../TypeScript/solveBoard";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faArrowRotateLeft,
  faCheck,
  faBrain,
  faLightbulb,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";

import { Cell } from "../../App"; 
interface UtilsButtonsProps {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  cellRefs: React.RefObject<(HTMLInputElement | null)[][]>;
  gridHistory: Cell[][][];
  setGridHistory: React.Dispatch<React.SetStateAction<Cell[][][]>>;
  conflictCells: { row: number; col: number; color: "conflict" | "valid" }[];
  setConflictCells: React.Dispatch<
    React.SetStateAction<
      { row: number; col: number; color: "conflict" | "valid" }[]
    >
  >;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setGameResult: React.Dispatch<React.SetStateAction<"win" | "lose" | null>>;
  hintCount: number;
  setHintCount: React.Dispatch<React.SetStateAction<number>>;
  clearBoard: () => void;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  hasCleared: boolean;
  setHasCleared: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightedCells: React.Dispatch<React.SetStateAction<{
    row: number;
    col: number;
    color: "focused" | "conflict";
}[]>>
}

const UtilsButtons: React.FC<UtilsButtonsProps> = ({
  grid,
  setGrid,
  setTimer,
  cellRefs,
  gridHistory,
  setGridHistory,
  conflictCells,
  setConflictCells,
  setIsGameOver,
  setGameResult,
  hintCount,
  setHintCount,
  clearBoard,
  hasCleared,
  setHasCleared,
  setHighlightedCells,
}) => {

  const toggleClearBtn = () => {

    clearBoard();
    setHasCleared(true);
  };

  const undoLastAction = () => {
    if (gridHistory.length > 0) {
      const lastGridState = gridHistory[gridHistory.length - 1];
      setGrid(lastGridState);
      setGridHistory(gridHistory.slice(0, -1));

      const lastConflictCell = conflictCells[conflictCells.length - 1];

      if (lastConflictCell && cellRefs.current) {
        const cellElement =
          cellRefs.current[lastConflictCell.row][lastConflictCell.col];
        if (cellElement) {
          cellElement.classList.remove("highlighted");
        }

        setConflictCells(conflictCells.slice(0, -1));
      }
      setHighlightedCells([]);
    }
  };

  const checkSolution = () => {
    const isBoardComplete = grid.every((row) =>
      row.every((cell) => cell.value !== "")
    );

    if (isBoardComplete) {
      if (isValidBoard(grid)) {
        setGameResult("win");
        setIsGameOver(true);
        setTimer(0);
        setGridHistory([]);
        setHasCleared(false);
      } else {
        setGameResult("lose");
        setIsGameOver(true);
        setHasCleared(false);
      }
    } else {
      toast.error("Hang in there! No empty cells allowed for completion📲!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleSolve = () => {
    const solution = solveBoard([...grid].map((row) => [...row])); // Deep copy grid
    if (solution) {
      // Save current grid to history before displaying the solution
      setGridHistory((prevHistory) => [
        ...prevHistory,
        JSON.parse(JSON.stringify(grid)),
      ]);

      setGrid(solution);
    } else {
      toast.error(
        "Unsolvable board! Check for any duplicate numbers in rows, columns, or boxes!",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    }
  };

const handleHint = () => {
  // Create a deep copy of the grid to preserve all the cells
  const gridCopy = grid.map((row) =>
    row.map((cell) => ({ ...cell })) // Creating a deep copy of each cell
  );

  const solution = solveBoard(gridCopy);

  // Check for conflicts before giving a hint
  const hasConflicts = conflictCells.length > 0 || !solution;
  if (hasConflicts) {
    toast.warn("Resolve conflicts first!", {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
      transition: Bounce,
    });
    return;
  }

  if (hintCount <= 0) {
    toast.info("No hints left 🙂!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    return;
  }

  if (solution) {
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col].value === "") {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      toast.info("Nothing left to solve—try verifying your solution🙂!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const hintGrid = grid.map((r, i) =>
        r.map((cell, j) =>
          i === row && j === col
            ? {
                ...cell,
                value: solution[row][col].value,
                readOnly: true
              }
            : cell
        )
      );
      setGrid(hintGrid);
      setHintCount((prevHintCount) => prevHintCount - 1);
    }
  }
};


  return (
    <>
      <div className="btns-div">
        <button className="undo-btn" onClick={undoLastAction}>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          <b>Undo</b>
        </button>
        <button onClick={checkSolution} className="check-solution-btn">
          <FontAwesomeIcon icon={faCheck} />
          <b>Check Solution</b>
        </button>
        <button
          onClick={handleSolve}
          className="solve-btn"
          disabled={!hasCleared}
        >
          <FontAwesomeIcon icon={faBrain} />
          <b>Solve</b>
          {!hasCleared && (
            <span className="tooltip">
              You should manually enter a board to solve it!
            </span>
          )}
        </button>
        <button
          onClick={handleHint}
          className={"hint-btn"}
          // disabled={hintCount <= 0}
        >
          <FontAwesomeIcon icon={faLightbulb} />
          <b>Hint</b>
          <b className="hints-nbrs">{hintCount}</b>
        </button>
        <button onClick={toggleClearBtn} className={"clear-board-btn"}>
          <FontAwesomeIcon icon={faEraser} />
          <b>Clear Board</b>
        </button>
        <ToastContainer />
      </div>
    </>
  );
};

export default UtilsButtons;
