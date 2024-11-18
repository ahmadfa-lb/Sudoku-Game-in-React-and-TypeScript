interface Cell {
  value: string;
  readOnly: boolean;
  status: "valid" | "invalid" | "empty";
}

const isSafe = (
  grid: Cell[][],
  row: number,
  col: number,
  num: string
): boolean => {
  for (let j = 0; j < 9; j++) {
    if (grid[row][j].value === num) return false;
  }

  for (let i = 0; i < 9; i++) {
    if (grid[i][col].value === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (grid[i][j].value === num) return false;
    }
  }

  return true;
};

export const solveBoard = (grid: Cell[][]): Cell[][] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === "") {
        for (let num = 1; num <= 9; num++) {
          const numStr = num.toString();
          if (isSafe(grid, row, col, numStr)) {
            grid[row][col].value = numStr;
            if (solveBoard(grid)) return grid;

            grid[row][col].value = "";
          }
        }
        return null;
      }
    }
  }
  return grid;
};
