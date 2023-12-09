import React from "react";
import { Cell } from "./GameBoard";

interface VisualCellProps {
  cell: Cell;
  onClick: (row: number, col: number) => void;
}

const VisualCell: React.FC<VisualCellProps> = ({ cell, onClick }) => {
  return (
    <div
      className={`cell ${cell.isHidden ? "hidden" : ""}`}
      onClick={() => onClick(cell.row, cell.col)}
    >
      {cell.val === -1 && !cell.isHidden && (
        <img
          src="src/images/Mine.gif"
          alt="Mine"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      )}
      {cell.val !== -1 && !cell.isHidden && cell.val !== 0 && cell.val}
    </div>
  );
};

export default VisualCell;
