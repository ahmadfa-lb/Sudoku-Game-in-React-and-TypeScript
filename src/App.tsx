// App.tsx
import React, { useState } from 'react';
import SudokuGrid from './components/SudokuGrid';
import NumberButtons from './components/NumbersBtns';
import './App.css';

const App: React.FC = () => {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>('');

  const handleNumberClick = (number: string) => {
    setSelectedNumber(number);
  };

  return (
    <div className='game-container'>
      <h1>Soduko Game</h1>
      <div className='mistakes'>Mistakes: <span>0/6</span></div>
      <SudokuGrid 
        focusedCell={focusedCell} 
        setFocusedCell={setFocusedCell} 
        selectedNumber={selectedNumber}
        grid={grid}
        setGrid={setGrid}
      />
      <NumberButtons onNumberClick={handleNumberClick} />
    </div>
  );
};

export default App;

