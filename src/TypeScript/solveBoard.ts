// const isSafe = (
//   grid: string[][],
//   row: number,
//   col: number,
//   num: string
// ): boolean => {
//   for (let j = 0; j < 9; j++) {
//     if (grid[row][j] === num) return false;
//   }

//   for (let i = 0; i < 9; i++) {
//     if (grid[i][col] === num) return false;
//   }

//   const startRow = Math.floor(row / 3) * 3;
//   const startCol = Math.floor(col / 3) * 3;
//   for (let i = startRow; i < startRow + 3; i++) {
//     for (let j = startCol; j < startCol + 3; j++) {
//       if (grid[i][j] === num) return false;
//     }
//   }

//   return true;
// };

// export const solveBoard = (grid: string[][]): string[][] | null => {
//   for (let row = 0; row < 9; row++) {
//     for (let col = 0; col < 9; col++) {
//       if (grid[row][col] === "") {
//         for (let num = 1; num <= 9; num++) {
//           const numStr = num.toString();
//           if (isSafe(grid, row, col, numStr)) {
//             grid[row][col] = numStr;
//             if (solveBoard(grid)) return grid;

//             grid[row][col] = "";
//           }
//         }
//         return null;
//       }
//     }
//   }
//   return grid;
// };



interface Cell {
  value: string; // The number in the cell
  readOnly: boolean; // Whether the cell is read-only
  status: "valid" | "invalid" | "empty"; // The current status of the cell
}

const isSafe = (
  grid: Cell[][],
  row: number,
  col: number,
  num: string
): boolean => {
  // Check the row
  for (let j = 0; j < 9; j++) {
    if (grid[row][j].value === num) return false;
  }

  // Check the column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col].value === num) return false;
  }

  // Check the 3x3 sub-grid
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
      // If the cell is empty, try filling it with a number
      if (grid[row][col].value === "") {
        for (let num = 1; num <= 9; num++) {
          const numStr = num.toString();
          if (isSafe(grid, row, col, numStr)) {
            grid[row][col].value = numStr; // Assign the number to the cell
            if (solveBoard(grid)) return grid; // Recursively solve the rest

            grid[row][col].value = ""; // Backtrack if no solution
          }
        }
        return null; // If no valid number found, return null
      }
    }
  }
  return grid; // Return the solved grid when all cells are filled
};
