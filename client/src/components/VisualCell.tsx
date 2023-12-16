import React from "react";
import { Cell } from "./GameBoard";

interface VisualCellProps {
  cell: Cell;
  onCellClick: (row: number, col: number, rightClick: boolean) => void;
}

const VisualCell: React.FC<VisualCellProps> = ({ cell, onCellClick}) => {
  return (
    <div
      className={`cell ${cell.isHidden ? "hidden" : ""}`}
      //onclick, but we indicate to our method it's not a right click
      onClick={() => onCellClick(cell.row, cell.col, false)}
      onContextMenu={(e) => {
        e.preventDefault(); // Prevent the default context menu
        console.log("right click");
        //same method, but now we tell the click handler in Minesweeper
        //that it is a right click
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
