interface Cell {
  value: string;
  readOnly: boolean;
  status: "valid" | "invalid" | "empty";
}

export const isValidBoard = (grid: Cell[][]): boolean => {
  const isUniqueAndFilled = (arr: Cell[]): boolean => {
    const values = arr.map(cell => cell.value).filter(value => value !== "");
    return new Set(values).size === values.length;
  };

  for (let i = 0; i < 9; i++) {
    const row = grid[i];
    const col = grid.map(row => row[i]);
    if (!isUniqueAndFilled(row) || !isUniqueAndFilled(col)) return false;
  }

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
  const value = grid[row][col].value;
  if (value === '') return true;

  for (let j = 0; j < 9; j++) {
    if (j !== col && grid[row][j].value === value) {
      return false;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col].value === value) {
      return false;
    }
  }

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

