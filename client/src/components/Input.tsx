/**
 * @fileoverview This file contains the Input component, which is responsible for
 * handling user commands in the Slither+ game. It includes a controlled input element for
 * command entry and a submit button.
 */
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { sendUpdateBoardMessage } from "./message/Message";
import GameState from "./game/GameState";

/**
 * @interface InputProps
 * Defines the props for the Input component.
 *
 * @property {number} focus - Numeric state to manage focus within the component.
 * @property {Dispatch<SetStateAction<number>>} setFocus - Function to update the focus state.
 * @property {GameState} gameState - The current state of the game, including the game board.
 * @property {WebSocket} socket - The client's WebSocket instance for communication with the server.
 * @property {Dispatch<SetStateAction<boolean>>} setIsOpen - Function to control the visibility of the help modal or popup.
 */
interface InputProps {
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
  gameState: GameState;
  socket: WebSocket;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Input is a React Functional Component that provides an interface for users to enter and submit commands for the Slither+ game.
 * It handles command processing and communicates with the server for game actions like revealing and flagging cells.
 *
 * @param {InputProps} props - The props for the Input component.
 * @returns {JSX.Element} The JSX element representing the command input interface for the Slither+ game.
 */
export function Input(props: InputProps) {
  const [status, setStatus] = useState<String>("Enter commands below!");
  const [commandString, setCommandString] = useState<string>("");

  function handleSubmit(string: string) {
    const args = string.split(" ");
    const row: number = parseFloat(args[1]);
    const col: number = parseFloat(args[2]);
    switch (args[0].toLowerCase()) {
      case "reveal":
        if (!props.gameState.board[row][col].isFlagged) {
          sendUpdateBoardMessage(
            props.socket,
            props.gameState.board[row][col],
            "reveal"
          );
        }
        break;
      case "flag":
        if (props.gameState.board[row][col].isHidden) {
          sendUpdateBoardMessage(props.socket, props.gameState.board[row][col], "flag");
        }
        break;
      default:
        setStatus(
          "Invalid command, please refer to the help button for more information!"
        );
        break;
    }
    setCommandString("");
  }

  return (
    <div className="repl-input">
      {/* COMMAND INPUT BAR */}
      <div
        className="container2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(commandString);
          }
        }}
      >
        <h5>Status: {status}</h5>

        <div>
          <ControlledInput
            value={commandString}
            setValue={setCommandString}
            ariaLabel={"Command input"}
            focus={props.focus}
            setFocus={props.setFocus}
          />
          {/* SUBMIT BUTTON for commands*/}
          <button onClick={() => handleSubmit(commandString)}>
            <div className="buttontext">Submit</div>
          </button>
        </div>
        <button onClick={() => props.setIsOpen(true)}>Help</button>
      </div>
    </div>
  );
}
