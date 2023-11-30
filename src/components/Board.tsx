import {board} from "../GameBoard"
import {VisualCell} from "./ViusalCell"
import {Cell} from "../GameBoard"

export function Board(){
    const handleCellClick = () => {
      
    };
    return (
      <div className="minesweeper-board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, k) => (
              <VisualCell
                key={`${i}-${k}`}
                val={board[i][k].val}
                isHidden={board[i][k].isHidden}
              />
            ))}
          </div>
        ))}
      </div>
    );
}

// cell={board[i][k]}
//onClick={handleCellClick}
        