/**
 * @fileoverview This file contains the Minesweeper component, which is the main component for rendering
 * the Minesweeper game interface. It handles the game board display, user interactions, and WebSocket
 * communications for game updates.
 */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "../styles/main.css";
import Board from "./Board";
import { createEmptyBoard, Cell } from "./GameBoard";
import GameState from "./game/GameState";
import { UpdateBoardMessage, sendUpdateBoardMessage } from "./message/Message";

/**
 * @interface MinesweeperProps
 * Defines the props for the Minesweeper component.
 *
 * @property {number} focus - Numeric state to manage focus within the component.
 * @property {Dispatch<SetStateAction<number>>} setFocus - Function to update the focus state.
 * @property {GameState} gameState - The current state of the game, including the game board.
 * @property {Dispatch<SetStateAction<GameState>>} setGameState - Function to update the game state.
 * @property {string} gameCode - The unique code of the game currently being played.
 * @property {WebSocket} socket - The client's WebSocket instance for communication with the server.
 */
interface MinesweeperProps {
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  gameCode: string;
  socket: WebSocket;
}

/**
 * Minesweeper is a React Functional Component that provides the main interface for the Minesweeper game.
 * It includes the game board and manages user interactions and game state updates through WebSocket communication.
 *
 * @param {MinesweeperProps} props - The props for the Minesweeper component.
 * @returns {JSX.Element} The JSX element representing the Minesweeper game interface.
 */
const Minesweeper: React.FC<MinesweeperProps> = ({
  focus,
  setFocus,
  gameState,
  setGameState,
  gameCode,
  socket,
}) => {
  /**
   * @const gameBoard - State for storing the current game board's cell data.
   */
  const [gameBoard, setGameBoard] = useState<Cell[][]>([]);
  /**
   * @const gameOver - State indicating whether the game is over.
   */
  const [gameOver, setGameOver] = useState<boolean>(false);
  /**
   * @const hidden - State for tracking the number of hidden cells remaining on the board.
   */
  const [hidden, setHidden] = useState<number>(100);
  /**
   * @const mines - The number of mines on the game board.
   */
  let mines: number = 5;

  /**
   * @const ref - A reference to the HTML element of the game component, used for managing focus.
   */
  const ref = useRef<HTMLDivElement | null>(null);

  /**
   * useEffect hook to initialize the game board.
   * It sets up a new game board when the component mounts.
   */
  useEffect(() => {
    const newBoard = createEmptyBoard(10, 10, mines);
    setGameBoard(newBoard);
  }, []);

  /**
   * useEffect hook to manage keyboard interactions.
   * It listens for the "Tab" key press to shift focus within the game component.
   */
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

  /**
   * Handles user clicks on the game board cells.
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   * @param {boolean} rightClick - Indicates if the cell was right-clicked.
   */
  const handleCellClick = (row: number, col: number, rightClick: boolean) => {
    if (!rightClick) {
      if (!gameState.board[row][col].isFlagged) {
        sendUpdateBoardMessage(socket, gameState.board[row][col], "reveal");
      }
    } else {
      if (gameState.board[row][col].isHidden) {
        sendUpdateBoardMessage(socket, gameState.board[row][col], "flag");
      }
    }
  };

  const handleHover = (row: number, col: number, isHovering: boolean) => {
    if (isHovering) {
      
      sendUpdateBoardMessage(socket, gameState.board[row][col], "highlight");
      
    } else {
      sendUpdateBoardMessage(socket, gameState.board[row][col], "unhighlight");
    }
  }; 

  console.log(gameState.gameOver);

  return (
    <div>
      <div className="game"></div>
      Game Code: {gameCode}
      {gameState.gameOver && <div>GAME OVER</div>}
      <Board onCellClick={handleCellClick} onHover={handleHover} board={gameState.board} />
    </div>
  );
};

export default Minesweeper;
