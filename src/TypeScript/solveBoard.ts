const isSafe = (
  grid: string[][],
  row: number,
  col: number,
  num: string
): boolean => {
  for (let j = 0; j < 9; j++) {
    if (grid[row][j] === num) return false;
  }

  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }

  return true;
};

export const solveBoard = (grid: string[][]): string[][] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === "") {
        for (let num = 1; num <= 9; num++) {
          const numStr = num.toString();
          if (isSafe(grid, row, col, numStr)) {
            grid[row][col] = numStr;
            if (solveBoard(grid)) return grid;

            grid[row][col] = "";
          }
        }
        return null;
      }
    }
  }
  return grid;
};