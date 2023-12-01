import { Cell } from "../GameBoard";

export const VisualCell = (cell: Cell, onClick: Function) => {
  return (
    // <div
    //   className={`cell ${cell.val == -1 ? "mine" : ""}`}
    //   onClick={() => onClick(cell.row, cell.col)}
    // >
    //   {cell.isMine ? "💣" : cell.adjacentMines}
    // </div>
    <div onClick={() => onClick(cell.row, cell.col)}>
      
    </div>
  );
};


