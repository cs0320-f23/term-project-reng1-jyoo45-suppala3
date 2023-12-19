/**
 * @fileoverview This file contains the main React component for the Minesweeper game. It manages
 * the overall game state, including the start of new games, joining existing games, customizing the
 * game board, and handling WebSocket communications with the Minesweeper server.
 */

import "../styles/App.css";
import Minesweeper from "./Minesweeper";
import { Input } from "./Input";
import { useState, Dispatch, SetStateAction } from "react";
import MessageType from "./message/MessageType";
import {
  CurrentBoardMessage,
  sendNewClientNoCodeMessage,
  sendNewClientWithCodeMessage,
  sendResetBoardMessage,
  sendCustomizeBoardMessage,
} from "./message/Message";
import Home from "./home/Home";
import GameState from "./game/GameState";
import { Cell } from "./GameBoard";

/**
 * Represents the main application component for the Minesweeper game.
 * This component is responsible for rendering the game's home screen or the game screen
 * and managing the overall game state and WebSocket communication.
 */
function App() {
  const [focus, setFocus] = useState<number>(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCode, setGameCode] = useState("");

  const [gameState, setGameState] = useState<GameState>({
    board: [],
    gameOver: false,
    gameCode: "abc",
  });

  const [isOpen, setIsOpen] = useState(false);
  const closePopup = () => {
    setIsOpen(false);
  };

  /**
   * Handles the event to restart the game. It sends a message to the server
   * requesting to reset the current game board.
   */
  function restartGame() {
    sendResetBoardMessage(socket, gameCode);
  }

  /**
   * Opens a modal for customizing the game board. This function sets the state to show
   * a modal where users can enter their desired number of rows, columns, and mines for the game board.
   */
  const [customRows, setCustomRows] = useState(10);
  const [customCols, setCustomCols] = useState(10);
  const [customMines, setCustomMines] = useState(10);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  function customizeBoard() {
    setShowCustomizeModal(true);
  }

  /**
   * Submits the board customization settings to the server. It sends a message to the server
   * with the custom number of rows, columns, and mines and closes the customization modal.
   */
  function submitCustomization() {
    sendCustomizeBoardMessage(socket, customRows, customCols, customMines);
    setShowCustomizeModal(false);
  }

  return (
    <div className="App">
      <p className="App-header">
        <h1>Minesweeper</h1>
      </p>

      {gameStarted ? (
        <div>
          <Input
            focus={focus}
            gameState={gameState}
            socket={socket}
            setFocus={setFocus}
            setIsOpen={setIsOpen}
          />

          <Minesweeper
            focus={focus}
            setFocus={setFocus}
            gameState={gameState}
            setGameState={setGameState}
            gameCode={gameCode}
            socket={socket}
          />
          {isOpen && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button className="close-button" onClick={closePopup}>
                  X
                </button>
                {/* Popup menu for game*/}
                <div className="menu">
                  <h2>To Play</h2>
                  <p>
                    Welcome to our version of minesweeper, where you can play
                    single player or multiplayer with as many players as you
                    want!
                  </p>

                  <p>All commands are zero indexed?</p>

                  <p>
                    Revealing location on board: You can either click the spot
                    that you want to reveal, or type into the command box
                    "reveal [row] [col]" : make sure to add the spaces between
                  </p>
                  <p>
                    Placing flag on board: You can either click the spot that
                    you want to flag, or type into the command box "flag [row]
                    [col]" : make sure to add the spaces between
                  </p>
                  <br></br>
                </div>
              </div>
            </div>
          )}
          {showCustomizeModal && (
            <div className="customize-modal">
              <div className="modal-content">
                <h2>Customize Board</h2>
                <input
                  type="number"
                  value={customRows}
                  onChange={(e) => setCustomRows(Number(e.target.value))}
                  placeholder="Rows"
                />
                <input
                  type="number"
                  value={customCols}
                  onChange={(e) => setCustomCols(Number(e.target.value))}
                  placeholder="Columns"
                />
                <input
                  type="number"
                  value={customMines}
                  onChange={(e) => setCustomMines(Number(e.target.value))}
                  placeholder="Mines"
                />
                <button onClick={submitCustomization} aria-label={"Submit"}>
                  Submit
                </button>
                <button onClick={() => setShowCustomizeModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
          <button onClick={restartGame} aria-label={"Restart"}>
            Restart Game!
          </button>
          <button onClick={customizeBoard} aria-label={"Customize"}>
            Customize
          </button>
        </div>
      ) : (
        <Home
          setGameStarted={setGameStarted}
          setGameCode={setGameCode}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
    </div>
  );
}

//----------------------------------------------------------------------------
// Websocket with backend set-up

/** Metadata for forming the URL to connect with the server websocket */
const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "//localhost",
  PORT: ":9000",
};

/** The client's websocket for communication with the server */
let socket: WebSocket;

/**
 * Registers a WebSocket for communication with the Minesweeper server. This function
 * is responsible for initializing the WebSocket connection and handling the events
 * like opening the connection, receiving messages, and errors.
 *
 * @param setGameStarted - Function to update the state indicating whether the game has started.
 * @param setErrorText - Function to display any error messages.
 * @param setGameCode - Function to set the game code of the current lobby.
 * @param gameState - The current state of the game.
 * @param setGameState - Function to update the game state.
 * @param username - The username of the client.
 * @param hasGameCode - Indicates whether the client is joining a game with a specific game code.
 * @param gameCode - The game code of the lobby to join, if applicable.
 */
export function registerSocket(
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  setErrorText: Dispatch<SetStateAction<string>>,
  setGameCode: Dispatch<SetStateAction<string>>,
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  username: string,
  hasGameCode: boolean,
  gameCode: string = ""
) {
  // running game on localhost
  socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);

  // running game on ngrok
  // socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST);

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    if (hasGameCode) {
      sendNewClientWithCodeMessage(socket, username, gameCode);
    } else {
      sendNewClientNoCodeMessage(socket, username);
    }
  };

  // different functionality based on received message type from server
  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    switch (message.type) {
      // successfully joined a game
      case MessageType.JOIN_SUCCESS: {
        setGameStarted(true);
        break;
      }

      // unsuccessfully joined a game
      case MessageType.JOIN_ERROR: {
        setErrorText("Error: Failed to join the game!");
        setGameStarted(false); // not truly necessary, just to be safe
        break;
      }

      case MessageType.RESTART_GAME: {
        const newBoardMessage: CurrentBoardMessage = message;
        const board: Cell[][] = newBoardMessage.data.board;
        const newGameState: GameState = { ...gameState };
        newGameState.board = board;
        newGameState.gameOver = newBoardMessage.data.gameOver;
        setGameState(newGameState);
        break;
      }

      // setting the client's game code
      case MessageType.SET_GAME_CODE: {
        console.log("gc");
        console.log(message.data.gameCode);
        setGameCode(message.data.gameCode);
        break;
      }

      // setting the client's game code
      case MessageType.CURRENT_BOARD: {
        console.log("updating board");
        const currentBoardMessage: CurrentBoardMessage = message;
        const board: Cell[][] = currentBoardMessage.data.board;
        const newGameState: GameState = { ...gameState };
        newGameState.board = board;
        newGameState.gameOver = currentBoardMessage.data.gameOver;
        setGameState(newGameState);
        break;
      }
    }
  };

  // if any error in the server occurs
  socket.onerror = () => setErrorText("Error: No server running!");
}

export default App;
