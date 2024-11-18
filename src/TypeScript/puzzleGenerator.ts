interface Cell {
  value: string;
  readOnly: boolean;
  status: "valid" | "invalid" | "empty"; 
}

const isSafe = (grid: string[][], row: number, col: number, num: string): boolean => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + i % 3;
      if (grid[boxRow][boxCol] === num) return false;
    }
    return true;
  };
  
  const getRandomNumbers = (): string[] => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  };
  
  const solveSudokuRandomized = (grid: string[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '') {
          const randomNumbers = getRandomNumbers();
          for (const num of randomNumbers) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudokuRandomized(grid)) return true;
              grid[row][col] = '';
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  export const generatePuzzle = (difficulty: string): Cell[][] => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(""));
    solveSudokuRandomized(grid);
  
    const cellsToClear =
      difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50;
  
    let clearedCells = 0;
    while (clearedCells < cellsToClear) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (grid[row][col] !== "") {
        grid[row][col] = "";
        clearedCells++;
      }
    }

    return grid.map((row) =>
      row.map((value) => ({
        value,
        readOnly: value !== "",
        status: value = "empty"
      }))
    );
  };
  