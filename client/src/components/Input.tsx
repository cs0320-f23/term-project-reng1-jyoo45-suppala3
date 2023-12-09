import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";


interface InputProps{
  focus: number;
  setFocus: Dispatch<SetStateAction<number>>;
}
export function Input(props: InputProps){

    const [commandString, setCommandString] = useState<string>("");
    //const [focus, setFocus] = useState<number>(1);

    function handleSubmit(string: string){
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