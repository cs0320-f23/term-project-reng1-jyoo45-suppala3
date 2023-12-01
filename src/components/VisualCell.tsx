import React from "react";
import { Cell } from "../GameBoard";

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
      {cell.isHidden ? "" : cell.val}
    </div>
  );
};

export default VisualCell;
