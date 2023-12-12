import "../styles/App.css";
import Minesweeper from "./Minesweeper";
import { Input } from "./Input";
import { useState, Dispatch, SetStateAction } from "react";
import MessageType from "./message/MessageType";
import {
  CurrentBoardMessage,
  UpdateBoardMessage,
  sendNewClientNoCodeMessage,
  sendNewClientWithCodeMessage,
} from "./message/Message";
import Home from "./home/Home";
import Game from "./Game";
import GameState from "./game/GameState";
import { Cell } from "./GameBoard";

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

  //TODO
  function restartGame(){
    setGameState({
      board: [],
      gameOver: false,
      gameCode: gameState.gameCode,
    });

    const restartMessage = {
      type: "RESTART_GAME",
      gameCode: gameCode,
    };

    socket.send(JSON.stringify(restartMessage));
  }

  return (
    <div className="App">
      <p className="App-header">
        <h1>Minesweeper</h1>
      </p>

      {gameStarted ? (
        <div>
          <div className="page-container">
            <div className="command-bar">
              <div>

              </div>
              <Input
                focus={focus}
                gameState={gameState}
                socket={socket}
                setFocus={setFocus}
              />
              <button onClick={() => setIsOpen(true)}>Help</button>
            </div>
          </div>
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
                {/* Your popup content goes here */}
                <div className="menu">
                  <h2>To Play</h2>
                  <p>Welcome to our version of minesweeper, where you can play single player or 
                    multiplayer with as many players as you want
                  </p>
                  <br></br>
                </div>
              </div>
            </div>
          )}
          <button onClick={restartGame}>Restart Game!</button>
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
 * Creates a websocket for communcation with the Slither+ server
 * @param setScores A funcion that sets the current leaderboard (set of scores) for the game
 * @param setGameStarted A function that sets whether or not the client has started playing the game
 * @param setErrorText A function that sets any error message to be rendered on the home page
 * @param setGameCode A function that sets the current lobby's game code
 * @param orbSet A list of all orbs stored in metadata form
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param username The username of the client
 * @param hasGameCode A boolean representing whether or not the client is
 * joining an existing game with a game code
 * @param gameCode The game code entered by the client, if applicable
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

      // console.log("UPDATE POSITION MESSAGE");
      // const updatePositionMessage: UpdatePositionMessage = message;
      // const toAdd: Position = updatePositionMessage.data.add;
      // const toRemove: Position = updatePositionMessage.data.remove;
      // const newGameState: GameState = { ...gameState };
      // console.log(
      //   "gameState otherbodies size: " + gameState.otherBodies.size
      // );
      // newGameState.otherBodies.delete(JSON.stringify(toRemove));
      // newGameState.otherBodies.add(JSON.stringify(toAdd));
      // setGameState(newGameState);
      // break;
    }
  };

  // if any error in the server occurs
  socket.onerror = () => setErrorText("Error: No server running!");
}

export default App;
