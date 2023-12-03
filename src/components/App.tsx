import "../styles/App.css";
import Minesweeper from "./Minesweeper";
import {Input} from "./Input"

function App() {
  return (
    <div className="App">
      <p className="App-header">
        <h1>Minesweeper</h1>
      </p>
      <Input></Input>
      <Minesweeper />
    </div>
  );
}

export default App;
