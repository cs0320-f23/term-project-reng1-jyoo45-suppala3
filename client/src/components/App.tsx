import "../styles/App.css";
import Minesweeper from "./Minesweeper";
import { Input } from "./Input";
import { useState, Dispatch, SetStateAction } from "react";
import MessageType from "./message/MessageType";
import {
  sendNewClientNoCodeMessage,
  sendNewClientWithCodeMessage,
} from "./message/Message";
import Home from "./home/Home";
import Game from "./Game";

function App() {
  const [focus, setFocus] = useState<number>(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCode, setGameCode] = useState("");

  return (
    <div className="App">
      <p className="App-header">
        <h1>Minesweeper</h1>
      </p>
      {/* {gameStarted ? (
        <Game gameCode={gameCode} socket={socket} />
      ) : (
        <Home setGameStarted={setGameStarted} setGameCode={setGameCode} />
      )} */}
      <Input focus={focus} setFocus={setFocus}></Input>
      <Minesweeper focus={focus} setFocus={setFocus} />
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
    }
  };

  // if any error in the server occurs
  socket.onerror = () => setErrorText("Error: No server running!");
}

export default App;
