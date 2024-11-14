import React, { useState, useEffect, useRef } from "react";
import SudokuGrid from "./components/SudokuGrid";
import NumberButtons from "./components/NumbersBtns";
import BoxResult from "./components/BoxResult";
import DifficultySelector from "./components/DifficultySelector";
import { generatePuzzle } from "./puzzleGenerator";
import { solveBoard } from "./solveBoard";
import SudokuImg from "./assets/sudoku_img.png";

import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isValidBoard } from "./validation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

library.add(fas, fab);

const App: React.FC = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [gridHistory, setGridHistory] = useState<string[][][]>([]);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 3;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [resetConflictCells, setResetConflictCells] = useState<() => void>(
    () => {}
  );
  // const [difficulty] = useState<string>("easy");
  const [conflictCells, setConflictCells] = useState<
    { row: number; col: number }[]
  >([]);
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [hintCount, setHintCount] = useState(3);

  useEffect(() => {
    const newPuzzle = generatePuzzle(difficulty);
    setGrid(newPuzzle);
  }, [difficulty]);

  const handleNumberClick = (number: string) => {
    if (focusedCell) {
      setGridHistory((prevHistory) => [
        ...prevHistory,
        JSON.parse(JSON.stringify(grid)),
      ]);
      setSelectedNumber(number);
    }
  };

  const undoLastAction = () => {
    if (gridHistory.length > 0) {
      const lastGridState = gridHistory[gridHistory.length - 1];
      setGrid(lastGridState);
      setGridHistory(gridHistory.slice(0, -1));

      const lastConflictCell = conflictCells[conflictCells.length - 1];

      if (lastConflictCell) {
        const cellElement =
          cellRefs.current[lastConflictCell.row][lastConflictCell.col];
        if (cellElement) {
          cellElement.classList.remove("highlighted");
        }

        setConflictCells(conflictCells.slice(0, -1));
      }
    }
  };

  const resetGame = (difficulty: string = "easy") => {
    setGrid(generatePuzzle(difficulty));
    setFocusedCell(null);
    setSelectedNumber("");
    setMistakes(0);
    setIsGameOver(false);
    setGameResult(null);
    resetConflictCells();
    setHintCount(3);
  };

  const checkSolution = () => {
    const isBoardComplete = grid.every((row) =>
      row.every((cell) => cell !== "")
    );

    if (isBoardComplete) {
      if (isValidBoard(grid)) {
        setGameResult("win");
        setIsGameOver(true);
        setTimer(0);
      } else {
        setGameResult("lose");
        setIsGameOver(true);
      }
    } else {
      // alert("The board is incomplete. Please fill in all cells.");
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

  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  // const handleDifficultySelect = (difficulty: string) => {
  //   resetGame(difficulty);
  // };

  const handleDifficultySelect = (newDifficulty: string) => {
    if (difficulty === "easy") {
      setTimer(0);
    }
    setDifficulty(newDifficulty); // This will trigger the useEffect and reset timer
    resetGame(newDifficulty);
  };

  const handleSolve = () => {
    const solution = solveBoard([...grid].map((row) => [...row])); // Deep copy grid
    if (solution) {
      // Save current grid to history before displaying the solution
      setGridHistory((prevHistory) => [
        ...prevHistory,
        JSON.parse(JSON.stringify(grid)),
      ]);

      setGrid(solution); // Display solution on the board
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

  // Handle hint request with conflict and limit check
  const handleHint = () => {
    const solution = solveBoard([...grid].map((row) => [...row]));

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

    // If solution exists, give hint
    if (solution) {
      const emptyCells = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === "") {
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
        const { row, col } =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const hintGrid = [...grid].map((row) => [...row]);
        hintGrid[row][col] = solution[row][col];

        setGrid(hintGrid);
        setHintCount(hintCount - 1);
      }
    }
  };

  const clearBoard = () => {
    setGrid(Array.from({ length: 9 }, () => Array(9).fill("")));
    setGridHistory([]);
    setFocusedCell(null);
    setSelectedNumber("");
    setMistakes(0);
    setConflictCells([]);
    setTimer(0);
  };

  useEffect(() => {
    setTimer(0); // Reset timer whenever difficulty changes
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [difficulty]); // Dependency array includes difficulty

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {isGameOver && (
        <BoxResult resetGame={resetGame} gameResult={gameResult!} />
      )}
      <div className="game-container">
        <div className="header">
          <h1 className="game-name">Sudoku Game</h1>
          <img src={SudokuImg} alt="Sudoku Icon" className="sudoku-image" />
        </div>
        <DifficultySelector
          items={difficulties}
          onSelect={handleDifficultySelect}
        />
        <div className="mistakes-timer-part">
          <div className="mistakes">
            Mistakes:{" "}
            <span>
              {mistakes}/{maxMistakes}
            </span>
          </div>
          <div className="timer">Time: {formatTime(timer)}</div>
        </div>
        <SudokuGrid
          focusedCell={focusedCell}
          setFocusedCell={setFocusedCell}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          grid={grid}
          setGrid={setGrid}
          mistakes={mistakes}
          setMistakes={setMistakes}
          maxMistakes={maxMistakes}
          setGameOver={setIsGameOver}
          conflictCells={conflictCells}
          setConflictCells={setConflictCells}
          setResetConflictCells={setResetConflictCells}
        />
        <NumberButtons onNumberClick={handleNumberClick} />
        <div className="btns-div">
          <button className="undo-btn" onClick={undoLastAction}>
            <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-left" />
            <b>Undo</b>
          </button>
          <button onClick={checkSolution} className="check-solution-btn">
            <FontAwesomeIcon icon="fa-solid fa-check" />
            <b>Check Solution</b>
          </button>
          <button onClick={handleSolve} className="solve-btn">
            <FontAwesomeIcon icon="fa-solid fa-brain" />
            <b>Solve</b>
          </button>
          <button
            onClick={handleHint}
            className={"hint-btn"}
            // disabled={hintCount <= 0}
          >
            <FontAwesomeIcon icon="fa-solid fa-lightbulb" />
            <b>Hint</b>
            <b className="hints-nbrs">{hintCount}</b>
          </button>
          <button onClick={clearBoard} className={"clear-board-btn"}>
            <FontAwesomeIcon icon="fa-solid fa-eraser" />
            <b>Clear Board</b>
          </button>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default App;
