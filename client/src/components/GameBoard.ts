/**
 * @fileoverview This file defines the Cell interface and a function for creating an empty game board for Minesweeper.
 */

/**
 * @interface Cell
 * Represents a single cell on the Minesweeper game board.
 *
 * @property {number} row - The row index of the cell on the game board.
 * @property {number} col - The column index of the cell on the game board.
 * @property {number} val - The value of the cell, representing the number of adjacent mines. A value of -1 indicates the cell contains a mine.
 * @property {boolean} isHidden - Indicates whether the cell is hidden or has been revealed.
 * @property {boolean} isFlagged - Indicates whether the cell has been flagged by the player as containing a suspected mine.
 */
export interface Cell {
  row: number;
  col: number;
  val: number;
  isHidden: boolean;
  isFlagged: boolean;
  isHighlighted: boolean;
}

/**
 * Creates and returns an empty game board for Minesweeper with the specified number of rows, columns, and mines.
 * The board is initialized with all cells hidden and not flagged. Mines are then randomly placed on the board.
 *
 * @param {number} rows - The number of rows for the game board.
 * @param {number} cols - The number of columns for the game board.
 * @param {number} mines - The total number of mines to be placed on the board.
 * @returns {Cell[][]} A two-dimensional array of Cell objects representing the initialized game board.
 */
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
        isFlagged: false,
        isHighlighted: false,
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
      board[randomRow][randomCol].val = -1; // Place a mine
      minesPlaced++;

      // Update adjacent cells
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = randomRow + i;
          const newCol = randomCol + j;

          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            board[newRow][newCol].val !== -1
          ) {
            board[newRow][newCol].val += 1;
          }
        }
      }
    }
  }

  return board;
};
