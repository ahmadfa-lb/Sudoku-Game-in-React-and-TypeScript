// // Utility function to check if the grid meets Sudoku rules
// Utility function to check if the grid meets Sudoku rules and contains no empty cells
export const isValidBoard = (grid: string[][]): boolean => {
  const isUniqueAndFilled = (arr: string[]) => {
    // Fail if there are any empty cells
    if (arr.includes('')) return false;
    // Check if all numbers are unique
    return new Set(arr).size === arr.length;
  };

  // Check rows and columns
  for (let i = 0; i < 9; i++) {
    const row = grid[i];
    const col = grid.map(row => row[i]);
    if (!isUniqueAndFilled(row) || !isUniqueAndFilled(col)) return false;
  }

  // Check 3x3 subgrids
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const subgrid = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          subgrid.push(grid[boxRow + i][boxCol + j]);
        }
      }
      if (!isUniqueAndFilled(subgrid)) return false;
    }
  }

  return true;
};


export const isValidSudoku = (grid: string[][], row: number, col: number): boolean => {
  const value = grid[row][col];
  if (value === '') return true; // Ignore empty cells

  // Check the row for duplicates
  for (let j = 0; j < 9; j++) {
    if (j !== col && grid[row][j] === value) {
      return false;
    }
  }

  // Check the column for duplicates
  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col] === value) {
      return false;
    }
  }

  // Check the 3x3 subgrid for duplicates
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const subgridRow = startRow + i;
      const subgridCol = startCol + j;
      if ((subgridRow !== row || subgridCol !== col) && grid[subgridRow][subgridCol] === value) {
        return false;
      }
    }
  }

  return true;
};
