export interface Cell {
  val: number;
  isHidden: boolean;
  row: number;
  col: number;
}

export const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  const board: Cell[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push({ val: 0, isHidden: true, row: i, col: j });
    }
    board.push(row);
  }
  board[5][5].val = -1;
  return board;
};

export const board = createEmptyBoard(10, 10);
