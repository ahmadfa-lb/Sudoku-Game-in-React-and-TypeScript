import React, { useState, useEffect, useRef } from "react";
import SudokuGrid from "./components/SudokuGrid/SudokuGrid";
import NumberButtons from "./components/NumbersBtns/NumbersBtns";
import BoxResult from "./components/BoxResult/BoxResult";
import UtilsButtons from "./components/UtilsButtons/UtilsButtons";
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import { generatePuzzle } from "./TypeScript/puzzleGenerator";
import SudokuImg from "./assets/sudoku_img.png";

import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
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

  const [conflictCells, setConflictCells] = useState<{ row: number; col: number; color: 'conflict' | 'valid' }[]>([]);

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

  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  const handleDifficultySelect = (newDifficulty: string) => {
    if (difficulty === "easy") {
      setTimer(0);
    }
    setDifficulty(newDifficulty);
    resetGame(newDifficulty);
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
        <BoxResult resetGame={resetGame} gameResult={gameResult!} currentDifficulty={difficulty}  />
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
          cellRefs={cellRefs}
          mistakes={mistakes}
          setMistakes={setMistakes}
          maxMistakes={maxMistakes}
          setGameOver={setIsGameOver}
          conflictCells={conflictCells}
          setConflictCells={setConflictCells}
          setResetConflictCells={setResetConflictCells}
        />
        <NumberButtons onNumberClick={handleNumberClick} />
        <UtilsButtons
          grid={grid}
          setGrid={setGrid}
          cellRefs={cellRefs}
          gridHistory={gridHistory}
          setGridHistory={setGridHistory}
          conflictCells={conflictCells}
          setConflictCells={setConflictCells}
          setIsGameOver={setIsGameOver}
          setGameResult={setGameResult}
          hintCount={hintCount}
          setHintCount={setHintCount}
          clearBoard={clearBoard}
          setTimer={setTimer}
        />
      </div>
    </>
  );
};

export default App;
