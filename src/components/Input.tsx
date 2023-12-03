import { useState } from "react";
import { ControlledInput } from "./ControlledInput";

export function Input(){

    const [commandString, setCommandString] = useState<string>("");

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