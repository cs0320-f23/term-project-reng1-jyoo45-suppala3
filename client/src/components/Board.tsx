import React from "react";
import { Cell } from "./GameBoard";
import VisualCell from "./VisualCell";

interface BoardProps {
  onCellClick: (row: number, col: number) => void;
  board: Cell[][];
}

const Board: React.FC<BoardProps> = ({ onCellClick, board }) => {
  return (
    <div className="minesweeper-div">
      <div className="minesweeper-board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, k) => (
              <VisualCell key={k} cell={cell} onClick={onCellClick} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
