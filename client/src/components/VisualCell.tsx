/**
 * @fileoverview This file contains the VisualCell component, which is used to render
 * individual cells of the Minesweeper game board. It handles user interactions with each cell.
 */
import React from "react";
import { Cell } from "./GameBoard";

/**
 * @interface VisualCellProps
 * Defines the props for the VisualCell component.
 *
 * @property {Cell} cell - The cell data to be rendered.
 * @property {function} onCellClick - Function to be called when the cell is clicked.
 * It accepts the row and column indices, and a boolean indicating if it was a right click.
 */
interface VisualCellProps {
  cell: Cell;
  onCellClick: (row: number, col: number, rightClick: boolean) => void;
}

/**
 * VisualCell is a React Functional Component that renders a single cell on the Minesweeper game board.
 * It displays the cell's current state (hidden, flagged, or revealed) and handles user clicks.
 *
 * @param {VisualCellProps} props - The props for the VisualCell component.
 * @returns {JSX.Element} A JSX element representing a cell on the Minesweeper game board.
 */
const VisualCell: React.FC<VisualCellProps> = ({ cell, onCellClick }) => {
  return (
    <div
      className={`cell ${cell.isHidden ? "hidden" : ""}`}
      onClick={() => onCellClick(cell.row, cell.col, false)}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("right click");
        onCellClick(cell.row, cell.col, true);
      }}
    >
      {cell.isFlagged && (
        <img
          src="src/images/Flag.png"
          alt="Flag"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      )}
      {!cell.isFlagged && cell.val === -1 && !cell.isHidden && (
        <img
          src="src/images/Mine.gif"
          alt="Mine"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      )}
      {!cell.isFlagged &&
        cell.val !== -1 &&
        !cell.isHidden &&
        cell.val !== 0 &&
        cell.val}
    </div>
  );
};

export default VisualCell;
