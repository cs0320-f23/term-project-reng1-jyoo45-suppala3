import { NumberLiteralType } from "typescript";

export interface Cell{
    row: number;
    col: number;
    val : number;
    isHidden : boolean;
}

const rows = 10;
const cols = 10;
export const board: Array<Array<Cell>> = Array.from({ length: rows }, (_, rowIndex) =>
  Array.from({ length: cols }, (_, colIndex) => ({
    val: 0,
    isHidden: true,
    row: rowIndex,
    col: colIndex
  }))
);


