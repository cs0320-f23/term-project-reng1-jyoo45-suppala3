export interface Cell {
  row: number;
  col: number;
  val: number;
  isHidden: boolean;
}

export const createEmptyBoard = (
  rows: number,
  cols: number,
  mines: number
): Cell[][] => {
  const board: Cell[][] = [];

  // Initialize the board with empty cells
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        row: i,
        col: j,
        val: 0,
        isHidden: true,
      };
    }
  }

  // Place mines randomly on the board
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    // Check if the cell already has a mine
    if (board[randomRow][randomCol].val !== -1) {
      board[randomRow][randomCol].val = -1;
      minesPlaced++;
    }
  }

  return board;
};

export const board: Cell[][] = createEmptyBoard(10, 10, 5);
