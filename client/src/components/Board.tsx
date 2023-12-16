/**
 * @fileoverview This file contains the Board component used in the Minesweeper game.
 * The Board component renders a grid of cells, each represented by the VisualCell component.
 */

import React from "react";
import { Cell } from "./GameBoard";
import VisualCell from "./VisualCell";

/**
 * @interface BoardProps
 * Defines the props for the Board component.
 *
 * @property {function} onCellClick - Function to be called when a cell is clicked. Takes row and column indices along with a flag indicating whether it was a right-click.
 * @property {Cell[][]} board - Two-dimensional array of Cell objects representing the current state of the Minesweeper board.
 */
interface BoardProps {
  onCellClick: (row: number, col: number, rightClick: boolean) => void;
  board: Cell[][];
}

/**
 * Board is a React Functional Component that renders the Minesweeper game board.
 * It creates a grid layout where each cell is represented by the VisualCell component.
 *
 * @param {BoardProps} props - The props for the Board component.
 * @returns {JSX.Element} The JSX element representing the Minesweeper board.
 */
const Board: React.FC<BoardProps> = ({ onCellClick, board }) => {
  return (
    <div className="minesweeper-div">
      <div className="minesweeper-board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, k) => (
              <VisualCell
                key={cell.row + "," + cell.col}
                cell={cell}
                onCellClick={onCellClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
