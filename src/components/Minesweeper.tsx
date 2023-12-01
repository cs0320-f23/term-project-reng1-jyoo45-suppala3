import React, { useEffect, useState } from "react";
import "../styles/main.css";
import Board from "./Board";
import { board, Cell, createEmptyBoard } from "../GameBoard";

const Minesweeper: React.FC = () => {
  const [gameBoard, setGameBoard] = useState<Cell[][]>(board);

  useEffect(() => {
    const newBoard = createEmptyBoard(10, 10);
    setGameBoard(newBoard);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    const updatedBoard = [...gameBoard];
    updatedBoard[row][col].isHidden = false;
    setGameBoard(updatedBoard);
  };

  return (
    <div>
      <div className="game"></div>
      <Board onCellClick={handleCellClick} board={gameBoard} />
    </div>
  );
};

export default Minesweeper;
