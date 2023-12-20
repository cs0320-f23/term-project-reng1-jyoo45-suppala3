import React, { useState, Dispatch, SetStateAction } from "react";

import { registerSocket } from "../App";
import GameState from "../game/GameState";

/**
 * Interface representing data for an HTML input that updates metadata based
 * on text editing and has some functionality on keys pressed.
 */
interface ControlledInputProps {
  /** A read-only value representing the value of the text input element. */
  value: string;
  /** A function that sets the value of the given read-only value. */
  setValue: Dispatch<SetStateAction<string>>;
  /** A function for the event the enter key is pressed. */
  onEnter: () => void;
  /** The text placeholder of the input HTML element. */
  placeholder: string;
}

/**
 * Creates and returns an input HTML element that updates metadata based
 * on text editing and with a custom functionality for when the enter key
 * is pressed
 *
 * @param value a read-only value representing the value of the text input element
 * @param setValue a function that sets the given read-only value
 * @param onEnter a function called when the enter key is pressed
 * @param placeholder the text placeholder for the returned input HTML element
 * @param className the class of the returned input HTML element
 * @returns
 */
function ControlledInput({
  value,
  setValue,
  onEnter,
  placeholder,
}: ControlledInputProps): JSX.Element {
  return (
    <input
      value={value}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(ev.target.value)
      }
      onKeyDown={(ev: React.KeyboardEvent<HTMLInputElement>): void => {
        if (ev.key === "Enter") {
          onEnter();
        }
      }}
      placeholder={placeholder}
    ></input>
  );
}

/**
 * An interface representing data passed to the home page HTML element
 */
interface HomeProps {
  /** A function that sets whether or not the client has started playing the game */
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  /** A function that sets the game code for the lobby the client is playing in */
  setGameCode: Dispatch<SetStateAction<string>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

/**
 * Creates and returns the home page, rendering a button which displays
 * how-to-play instructions upon clicking, an input box for specifying one's
 * username, a button to create a new game, and an input box for specifying a
 * custom, already live game, with a button to join said game
 *
 * @param setGameStarted A function that sets whether or not the client has started playing the game
 * @param setScores A function that sets the current leaderboard (set of scores) for the game
 * @param setGameCode A function that sets the game code for the lobby the client is playing in
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param orbSet A list of all orbs stored in metadata form
 * @returns the home page of the Minesweeper game
 */
export default function Home({
  setGameStarted,
  setGameCode,
  gameState,
  setGameState,
}: HomeProps): JSX.Element {
  const [username, setUsername] = useState("");
  const [inputGamecode, setInputGamecode] = useState("");
  const [errorText, setErrorText] = useState("");

  // registers the client's websocket to handle joining a new game
  const startNewGame = (): void => {
    if (username.trim().length === 0) {
      setErrorText("Your username should be non-empty!");
      return;
    }
    setErrorText("");
    try {
      registerSocket(
        setGameStarted,
        setErrorText,
        setGameCode,
        gameState,
        setGameState,
        username,
        false
      );
    } catch (e) {
      // check server status
      setErrorText("Error: Could not connect to server!");
    }
  };

  // registers the client's websocket to handle joining a game with a code
  const startGameWithCode = (): void => {
    if (username.trim().length === 0) {
      //check that name is not empty
      setErrorText("Your username should be non-empty!");
      return;
    }
    setErrorText("");
    try {
      registerSocket(
        setGameStarted,
        setErrorText,
        setGameCode,
        gameState,
        setGameState,
        username,
        true,
        inputGamecode
      );
    } catch (e) {
      // check server status
      setErrorText("Error: Could not connect to server!");
    }
  };

  return (
    <div>
      <h2>Enter your username:</h2>
      <ControlledInput
        value={username}
        setValue={setUsername}
        onEnter={() => {
          if (inputGamecode.length === 0) {
            startNewGame();
          } else {
            startGameWithCode();
          }
        }}
        placeholder="Type your username here:"
        aria-label={"Username Input"}
      />
      <p aria-label="error-text" data-testid="error-text">
        {" "}
        {errorText}
      </p>
      <span>
        <button onClick={startNewGame} aria-label={"Create Game Button"}>
          Create a new game
        </button>{" "}
        <h4>OR</h4>
        <h4>Join with a game code</h4>
        <ControlledInput
          value={inputGamecode}
          setValue={setInputGamecode}
          onEnter={startGameWithCode}
          placeholder="Enter gamecode here:"
          aria-label={"Gamecode Input"}
        />
        <br />
        <button onClick={startGameWithCode} aria-label={"Join Game Button"}>
          Join with a game code
        </button>{" "}
      </span>
    </div>
  );
}
