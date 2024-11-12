import React, { useState, useEffect, useRef } from 'react';
import SudokuGrid from './components/SudokuGrid';
import NumberButtons from './components/NumbersBtns';
import BoxResult from './components/BoxResult';
import DifficultySelector from './components/DifficultySelector'
import { generatePuzzle } from './puzzleGenerator';


import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isValidBoard } from './validation';

library.add(fas, fab);

const App: React.FC = () => {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [gridHistory, setGridHistory] = useState<string[][][]>([]);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 3;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [resetConflictCells, setResetConflictCells] = useState<() => void>(() => {});
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [conflictCells, setConflictCells] = useState<{ row: number; col: number }[]>([]);
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );



  useEffect(() => {
    const newPuzzle = generatePuzzle(difficulty);
    setGrid(newPuzzle);
  }, [difficulty]);

  const handleNumberClick = (number: string) => {
    if (focusedCell) {
      setGridHistory(prevHistory => [...prevHistory, JSON.parse(JSON.stringify(grid))]);
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
        const cellElement = cellRefs.current[lastConflictCell.row][lastConflictCell.col];
        if (cellElement) {
          cellElement.classList.remove('highlighted');
        }
  
        setConflictCells(conflictCells.slice(0, -1));
      }
    }
  };
  


  

  const resetGame = (difficulty: string = 'easy') => {
    setGrid(generatePuzzle(difficulty));
    setFocusedCell(null);
    setSelectedNumber('');
    setMistakes(0);
    setIsGameOver(false);
    setGameResult(null);
    resetConflictCells();
  };

  const checkSolution = () => {
    const isBoardComplete = grid.every(row => row.every(cell => cell !== ''));

    if (isBoardComplete) {
      if (isValidBoard(grid)) {
        setGameResult('win');
        setIsGameOver(true);
      } else {
        setGameResult('lose');
        setIsGameOver(true);
      }
    } else {
      alert("The board is incomplete. Please fill in all cells.");
    }
  };


  const difficulties = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const handleDifficultySelect = (difficulty: string) => {
    resetGame(difficulty);
  };


  return (
    <>
      {isGameOver && <BoxResult resetGame={resetGame} gameResult={gameResult!} />}
      <div className='game-container'>
        <h1 className='game-name'>Sudoku Game</h1>
        <div className='diff'>
          <h1>Select Difficulty:</h1>
          <DifficultySelector items={difficulties} onSelect={handleDifficultySelect} />
        </div>
        <div className="mistakes">Mistakes: <span>{mistakes}/{maxMistakes}</span></div>
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
        <div className='btns-div'>
        <button className='undo-btn' onClick={undoLastAction}>
          <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-left" />
          <b>Undo</b>
        </button>
        <button onClick={checkSolution} className="check-solution-btn">
          Check Solution
        </button>
        </div>
      </div>
    </>
  );
};

export default App;



