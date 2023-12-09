import { Cell } from "../GameBoard";


/**
 * An interface representing the state of the client's game
 */
export default interface GameState {
  /** A metadata representation of the client's snake */
  board: Cell[][];

  /** The game code of the current lobby being played */
  gameCode: String;
}