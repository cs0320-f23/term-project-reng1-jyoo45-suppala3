import "../styles/App.css";
import Minesweeper from "./Minesweeper";
import {Input} from "./Input"
import { useState } from "react";


function App() {
  const [focus, setFocus] = useState<number>(1);

  return (
    <div className="App">
      <p className="App-header">
        <h1>Minesweeper</h1>
      </p>
      <Input focus={focus} setFocus={setFocus}></Input>
      <Minesweeper focus={focus} setFocus={setFocus}/>
    </div>
  );
}

export default App;
