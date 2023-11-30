export interface Cell{
    val : number;
    isHidden : boolean;
}

const rows = 10;
const cols = 10;
export const board: Array<Array<Cell>> = Array.from({ length: rows }, () => Array(cols).fill({val: 0, isHidden: true}));


