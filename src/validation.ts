// Utility function to check if the grid meets Sudoku rules
export const isValidSudoku = (grid: string[][]): boolean => {
    const isUnique = (arr: string[]) => {
      const filtered = arr.filter(num => num !== '');
      return new Set(filtered).size === filtered.length;
    };
  
    // Check rows and columns
    for (let i = 0; i < 9; i++) {
      const row = grid[i];
      const col = grid.map(row => row[i]);
      if (!isUnique(row) || !isUnique(col)) return false;
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
        if (!isUnique(subgrid)) return false;
      }
    }
  
    return true;
  };
  