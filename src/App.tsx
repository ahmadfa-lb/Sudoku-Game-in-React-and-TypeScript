// App.tsx
import React, { useState } from 'react';
import SudokuGrid from './components/SudokuGrid';
import NumberButtons from './components/NumbersBtns';
import './App.css';

// src/App.tsx or src/fontAwesome.ts
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


library.add(fas, fab);


const App: React.FC = () => {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 3;


  const handleNumberClick = (number: string) => {
    if (focusedCell)
      setSelectedNumber(number);
  };

  return (
    <div className='game-container'>
      <h1>Soduko Game</h1>
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
      />
      <button className='undo-btn'><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-left" /></button>
      <NumberButtons onNumberClick={handleNumberClick} />
    </div>
  );
};

export default App;

