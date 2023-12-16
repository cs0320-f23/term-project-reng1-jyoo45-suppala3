import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { sendUpdateBoardMessage } from "./message/Message";
import GameState from "./game/GameState";


interface InputProps{
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
  gameState: GameState;
  socket: WebSocket;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function Input(props: InputProps){

    const [status, setStatus] = useState<String>("Enter commands below!")
    const [commandString, setCommandString] = useState<string>("");
    //const [focus, setFocus] = useState<number>(1);

    function handleSubmit(string: string){
        const args = string.split(" ");
        const row: number = parseFloat(args[1]);
        const col: number = parseFloat(args[2]);
        switch(args[0].toLocaleLowerCase()){
            case "reveal":
              if(!props.gameState.board[row][col].isFlagged){
                  sendUpdateBoardMessage(
                    props.socket,
                    props.gameState.board[row][col],
                    "reveal"
                  );
              }
              break;
            case "flag":
              sendUpdateBoardMessage(
                props.socket,
                props.gameState.board[row][col],
                "flag"
              );
              break;
            default:
              setStatus("Invalid command, please refer to the help button for more information!")
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