import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import "../styles/main.css";
import Board from "./Board";
import { createEmptyBoard, Cell } from "../GameBoard";

interface MinesweeperProps{
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
}

const Minesweeper: React.FC<MinesweeperProps> = ({ focus, setFocus }) => {
  const [gameBoard, setGameBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hidden, setHidden] = useState<number>(100);
  let mines: number = 5; // Change the number of mines as needed

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newBoard = createEmptyBoard(10, 10, mines); // Adjust the board size and number of mines
    setGameBoard(newBoard);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Tab" && focus === 0) {
        event.preventDefault();
        ref.current?.focus();
        setFocus(1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [focus]);

  const revealEmptySquares = (row: number, col: number) => {
    if (
      row >= 0 &&
      row < gameBoard.length &&
      col >= 0 &&
      col < gameBoard[0].length
    ) {
      const cell = gameBoard[row][col];

      if (cell.isHidden && cell.val === 0) {
        // If the cell is hidden and has no adjacent mines
        const updatedBoard = [...gameBoard];
        updatedBoard[row][col].isHidden = false;
        setHidden((prevHidden) => prevHidden - 1);

        // Recursively reveal adjacent empty squares
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmptySquares(row + i, col + j);
          }
        }
      } else if (cell.isHidden && cell.val > 0) {
        // If the cell is hidden and has adjacent mines, reveal only this cell
        const updatedBoard = [...gameBoard];
        updatedBoard[row][col].isHidden = false;
        setHidden((prevHidden) => prevHidden - 1);
        setGameBoard(updatedBoard);
      }
    }
  };

  const revealAllMines = () => {
    // Helper function to reveal all mines when the game is over
    const updatedBoard = gameBoard.map((row) =>
      row.map((cell) => ({
        ...cell,
        isHidden: cell.val === -1 ? false : cell.isHidden,
      }))
    );
    setGameBoard(updatedBoard);
  };

  async function initializeGameBackend() {
    return await fetch("TODO fetch link")
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          setGameBoard(json["board"]);
          mines = json["mines"];
          setHidden(json["hidden"]);
        }
      })
      .catch((error) => {
        return undefined;
      });
  }

  const handleCellClick = (row: number, col: number) => {
    if (!gameOver) {
      const updatedBoard = [...gameBoard];
      const cell = updatedBoard[row][col];

      if (cell.isHidden) {
        if (cell.val === -1) {
          // Clicked on a mine, reveal all mines and end the game
          revealAllMines();
          setGameOver(true);
        } else if (cell.val === 0) {
          // Clicked on an empty square, reveal adjacent empty squares
          revealEmptySquares(row, col);
        } else {
          // Clicked on a numbered square, reveal only this cell
          updatedBoard[row][col].isHidden = false;
          setHidden((prevHidden) => prevHidden - 1);
          setGameBoard(updatedBoard);
        }

        if (hidden === mines) {
          // All non-mine cells are revealed, game over
          setGameOver(true);
        }
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
