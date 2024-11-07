import { useState } from 'react'
import './App.css'
import SudokuGrid from './components/SudokuGrid';
import numbersBtns from './components/NumbersBtns'


function App() {

  return (
    <div className='container'>
    <h1>Sudoku Game</h1>
    <SudokuGrid />
    {/* <NumbersBtns /> */}
  </div>
  )
}

export default App
