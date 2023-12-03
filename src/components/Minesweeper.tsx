import React, { useEffect, useState } from "react";
import "../styles/main.css";
import Board from "./Board";
import { board, Cell, createEmptyBoard } from "../GameBoard";

const Minesweeper: React.FC = () => {
  const [gameBoard, setGameBoard] = useState<Cell[][]>(board);

  const [gameOver, setGameOver] = useState<boolean>(false);

  const [hidden, setHidden] = useState<number>(100);
  const mines: number = 1;

  useEffect(() => {
    const newBoard = createEmptyBoard(10, 10);
    setGameBoard(newBoard);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if(!gameOver){
      setHidden(hidden - 1);
      const updatedBoard = [...gameBoard];
      updatedBoard[row][col].isHidden = false;
      if(gameBoard[row][col].val === -1){
        setGameOver(true);
      }
      setGameBoard(updatedBoard);
      if(hidden == mines){
        setGameOver(true);
      }
    }
  };

  return (
    <div>
      <div className="game"></div>
      <Board onCellClick={handleCellClick} board={gameBoard} />
    </div>
  );
};

export default Minesweeper;
