interface Cell {
  value: string; // The value in the cell, e.g., "1", "2", "3", etc.
  readOnly: boolean; // Whether the cell is read-only
  status: "valid" | "invalid" | "empty"; // Status of the cell
}

export const isValidBoard = (grid: Cell[][]): boolean => {
  // Helper function to check if an array of Cells has unique and non-empty values
  const isUniqueAndFilled = (arr: Cell[]): boolean => {
    const values = arr.map(cell => cell.value).filter(value => value !== ""); // Extract non-empty values
    return new Set(values).size === values.length; // Check for uniqueness
  };

  // Validate rows and columns
  for (let i = 0; i < 9; i++) {
    const row = grid[i];
    const col = grid.map(row => row[i]);
    if (!isUniqueAndFilled(row) || !isUniqueAndFilled(col)) return false;
  }

  // Validate 3x3 subgrids
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const subgrid: Cell[] = [];
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



export const isValidSudoku = (grid: Cell[][], row: number, col: number): boolean => {
  const value = grid[row][col].value; // Access the value of the cell
  if (value === '') return true; // Ignore empty cells

  // Check the row for duplicates (ignoring the current cell)
  for (let j = 0; j < 9; j++) {
    if (j !== col && grid[row][j].value === value) {
      return false;
    }
  }

  // Check the column for duplicates (ignoring the current cell)
  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col].value === value) {
      return false;
    }
  }

  // Check the 3x3 subgrid for duplicates (ignoring the current cell)
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const subgridRow = startRow + i;
      const subgridCol = startCol + j;
      if (
        (subgridRow !== row || subgridCol !== col) &&
        grid[subgridRow][subgridCol].value === value
      ) {
        return false;
      }
    }
  }

  return true;
};

