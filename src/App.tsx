// import React, { useState } from 'react';
// import SudokuGrid from './components/SudokuGrid';
// import NumberButtons from './components/NumbersBtns';
// import BoxResult from './components/BoxResult';
// import './App.css';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { fab } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { isValidBoard } from './validation';

// library.add(fas, fab);

// const App: React.FC = () => {
//   const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
//   const [gridHistory, setGridHistory] = useState<string[][][]>([]); // Track grid history
//   const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
//   const [selectedNumber, setSelectedNumber] = useState<string>('');
//   const [mistakes, setMistakes] = useState(0);
//   const maxMistakes = 3;
//   const [isGameOver, setIsGameOver] = useState<boolean>(false);

//   const handleNumberClick = (number: string) => {
//     if (focusedCell) {
//       // Save current grid to history before making a change
//       setGridHistory(prevHistory => [...prevHistory, JSON.parse(JSON.stringify(grid))]);
//       setSelectedNumber(number);
//     }
//   };

//   const undoLastAction = () => {
//     if (gridHistory.length > 0) {
//       // Revert to the last grid state
//       const lastGridState = gridHistory[gridHistory.length - 1];
//       setGrid(lastGridState);
//       setGridHistory(gridHistory.slice(0, -1)); // Remove last state from history
//     }
//   };

//   const resetGame = () => {
//     setGrid(Array.from({ length: 9 }, () => Array(9).fill('')));
//     setGridHistory([]); // Clear history on reset
//     setFocusedCell(null);
//     setSelectedNumber('');
//     setMistakes(0);
//     setIsGameOver(false);
//   };

//   const checkSolution = () => {
//     if (isValidBoard(grid)) { // Assuming isValidSudoku validates the entire grid
//       alert("Congratulations! The puzzle is solved.");
//       resetGame();
//     } else {
//       alert("The puzzle is incomplete or has conflicts.");
//     }
//   };

//   return (
//     <>
//       {isGameOver && <BoxResult resetGame={resetGame} />}
//       <div className='game-container'>
//         <h1>Sudoku Game</h1>
//         <div className="mistakes">Mistakes: <span>{mistakes}/{maxMistakes}</span></div>
//         <SudokuGrid 
//           focusedCell={focusedCell} 
//           setFocusedCell={setFocusedCell} 
//           selectedNumber={selectedNumber}
//           setSelectedNumber={setSelectedNumber}
//           grid={grid}
//           setGrid={setGrid}
//           mistakes={mistakes}
//           setMistakes={setMistakes}
//           maxMistakes={maxMistakes}
//           setGameOver={setIsGameOver}
//         />
//         <button className='undo-btn' onClick={undoLastAction}>
//           <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-left" />
//           <b>Undo</b>
//         </button>
//         <button onClick={checkSolution} className="check-solution-btn">
//           Check Solution
//         </button>
//         <NumberButtons onNumberClick={handleNumberClick} />
//       </div>
//     </>
//   );
// };

// export default App;


// App.tsx
import React, { useState } from 'react';
import SudokuGrid from './components/SudokuGrid';
import NumberButtons from './components/NumbersBtns';
import BoxResult from './components/BoxResult';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isValidBoard } from './validation';

library.add(fas, fab);

const App: React.FC = () => {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [gridHistory, setGridHistory] = useState<string[][][]>([]); // Track grid history
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 3;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null); // Manage game result

  const handleNumberClick = (number: string) => {
    if (focusedCell) {
      // Save current grid to history before making a change
      setGridHistory(prevHistory => [...prevHistory, JSON.parse(JSON.stringify(grid))]);
      setSelectedNumber(number);
    }
  };

  const undoLastAction = () => {
    if (gridHistory.length > 0) {
      // Revert to the last grid state
      const lastGridState = gridHistory[gridHistory.length - 1];
      setGrid(lastGridState);
      setGridHistory(gridHistory.slice(0, -1)); // Remove last state from history
    }
  };

  const resetGame = () => {
    setGrid(Array.from({ length: 9 }, () => Array(9).fill('')));
    setGridHistory([]); // Clear history on reset
    setFocusedCell(null);
    setSelectedNumber('');
    setMistakes(0);
    setIsGameOver(false);
    setGameResult(null); // Reset game result
  };

  const checkSolution = () => {
    // Check if the board is completely filled
    const isBoardComplete = grid.every(row => row.every(cell => cell !== ''));

    if (isBoardComplete) {
      if (isValidBoard(grid)) {
        setGameResult('win');
        setIsGameOver(true);  // Trigger the game over modal
      } else {
        setGameResult('lose');
        setIsGameOver(true);  // Trigger the game over modal
      }
    } else {
      alert("The board is incomplete. Please fill in all cells.");
    }
  };

  return (
    <>
      {isGameOver && <BoxResult resetGame={resetGame} gameResult={gameResult!} />} {/* Pass gameResult */}
      <div className='game-container'>
        <h1>Sudoku Game</h1>
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
