import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { sendUpdateBoardMessage } from "./message/Message";
import GameState from "./game/GameState";


interface InputProps{
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
  gameState: GameState;
  socket: WebSocket;
}

export function Input(props: InputProps){

    const [commandString, setCommandString] = useState<string>("");
    //const [focus, setFocus] = useState<number>(1);

    function handleSubmit(string: string){
        const args = string.split(" ");
        switch(args[0].toLocaleLowerCase()){
            case "clear":
              const row : number = parseFloat(args[1]);
              const col: number = parseFloat(args[2]);
              sendUpdateBoardMessage(props.socket, props.gameState.board[row][col]);
              return;
            case "flag":
              //add flag here
              return;
            default:
              
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
          <ControlledInput
            value={commandString}
            setValue={setCommandString}
            ariaLabel={"Command input"}
            focus={props.focus}
            setFocus={props.setFocus}
          />
          <br></br>

          {/* SUBMIT BUTTON */}
          <button onClick={() => handleSubmit(commandString)}>
            <div className="buttontext">Submit</div>
          </button>
        </div>
      </div>
    );
}