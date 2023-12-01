import {board} from "../GameBoard"
import {VisualCell} from "./ViusalCell"
import {Cell} from "../GameBoard"

export function Board(){
    const handleCellClick = (row: number, col:number) => {
      board[row][col].isHidden = false;
    };

    return (
      <div className="minesweeper-board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, k) => (
              <VisualCell
                val={board[i][k].val}
                isHidden={board[i][k].isHidden}
                row={board[i][k].col}
                col={board[i][k].col}/>
            ))}
          </div>
        ))}
      </div>
    );
}

/* <VisualCell
                val={board[i][k].val}
                isHidden={board[i][k].isHidden}
                row={board[i][k].col}
                col={board[i][k].col}
              /> */
// cell={board[i][k]}
//onClick={handleCellClick}
        