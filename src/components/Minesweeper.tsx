import "../styles/main.css";
import { Board } from "./Board";

export default function Minesweeper() {
  return(<div>
    <div className="game"></div>;
    <Board></Board>
  </div>);
  
}
