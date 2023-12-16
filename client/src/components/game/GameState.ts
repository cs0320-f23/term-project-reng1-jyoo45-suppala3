import { Cell } from "../GameBoard";

/**
 * An interface representing the current state of the client's
 * game (their progress and whether the game is over
 */
export default interface GameState {
  /** A metadata representation of the board */
  board: Cell[][];

  gameOver: boolean;

  /** The game code of the current lobby being played */
  gameCode: String;
}
