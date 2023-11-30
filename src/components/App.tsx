import "../styles/App.css";
import Minesweeper from "./Minesweeper";
import REPL from "./Minesweeper";

function App() {
  return (
    <div className="App">
      <p className="App-header">
        <h1>Minesweeper</h1>
      </p>
      <Minesweeper />
    </div>
  );
}

export default App;
