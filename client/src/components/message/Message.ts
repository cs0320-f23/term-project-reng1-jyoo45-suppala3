import { Cell } from "../GameBoard";
import MessageType from "./MessageType";

/**
 * Represents the default generic interface for any message sent or received to
 * the Minesweeper server.
 */
export default interface Message {
  /** The type (purpose) of the message sent or received */
  type: MessageType;
  /** The data sent as part of the message */
  data: any;
}

/**
 * Represents a message sent to the server to register the client for a new game without a specified game code.
 */
export interface NewClientNoCodeMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.NEW_CLIENT_NO_CODE;
  /** The data sent with the message containing the client's username. */
  data: {
    username: string;
  };
}

/**
 * Represents a message sent to the server to register the client for an already running game with a specified game code.
 */
export interface NewClientOldCodeMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.NEW_CLIENT_WITH_CODE;
  /** The data sent with the message containing the client's username and the specified game code for the lobby to join. */
  data: {
    username: string;
    gameCode: string;
  };
}

/**
 * Represents a message sent to the server to update the board based on the client's action.
 */
export interface UpdateBoardMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.UPDATE_BOARD;
  /** The data sent with the message containing the cell affected and the action taken. */
  data: {
    cell: Cell;
    action: string;
  };
}

/**
 * Represents a message sent to the server to reset the current game's board.
 */
export interface ResetBoardMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.RESTART_GAME;
  /** The data sent with the message containing the game code of the lobby to reset. */
  data: {
    GameCode: string;
  };
}

/**
 * Represents a message sent to the server indicating the current state of the board.
 */
export interface CurrentBoardMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.CURRENT_BOARD;
  /** The data sent with the message containing the current state of the board and the game over status. */
  data: {
    board: Cell[][];
    gameOver: boolean;
  };
}

/**
 * Sends a message to the server to register the client for a new game without a specified game code.
 * @param socket - The client's websocket for communication with the server.
 * @param username - The client's username.
 */
export function sendNewClientNoCodeMessage(
  socket: WebSocket,
  username: string
): void {
  const message: NewClientNoCodeMessage = {
    type: MessageType.NEW_CLIENT_NO_CODE,
    data: {
      username: username,
    },
  };
  socket.send(JSON.stringify(message));
}

/**
 * Sends a message to the server to register the client for joining a game with the specified game code.
 * @param socket - The client's websocket for communication with the server.
 * @param username - The client's username.
 * @param gameCode - The game code of the lobby to join.
 */
export function sendNewClientWithCodeMessage(
  socket: WebSocket,
  username: string,
  gameCode: string
): void {
  const message: NewClientOldCodeMessage = {
    type: MessageType.NEW_CLIENT_WITH_CODE,
    data: {
      username: username,
      gameCode: gameCode,
    },
  };
  socket.send(JSON.stringify(message));
}

/**
 * Sends a message to the server to update the game board based on the client's action.
 * @param socket - The client's websocket for communication with the server.
 * @param cell - The cell affected by the client's action.
 * @param action - The action performed on the cell.
 */
export function sendUpdateBoardMessage(
  socket: WebSocket,
  cell: Cell,
  action: string
): void {
  const message: UpdateBoardMessage = {
    type: MessageType.UPDATE_BOARD,
    data: {
      cell: cell,
      action: action,
    },
  };
  socket.send(JSON.stringify(message));
}

/**
 * Sends a message to the server to reset the game board while keeping the same game session active.
 * @param socket - The client's websocket for communication with the server.
 * @param gameCode - The game code of the lobby to reset.
 */
export function sendResetBoardMessage(
  socket: WebSocket,
  gameCode: string
): void {
  const message: ResetBoardMessage = {
    type: MessageType.RESTART_GAME,
    data: {
      GameCode: gameCode,
    },
  };
  socket.send(JSON.stringify(message));
}

/**
 * Sends a message to the server to customize the game board dimensions and number of mines.
 * @param socket - The client's websocket for communication with the server.
 * @param rows - The number of rows for the new game board.
 * @param cols - The number of columns for the new game board.
 * @param mines - The number of mines for the new game board.
 */
export function sendCustomizeBoardMessage(
  socket: WebSocket,
  rows: number,
  cols: number,
  mines: number
) {
  const message = {
    type: MessageType.CUSTOMIZE_BOARD,
    data: {
      rows,
      cols,
      mines,
    },
  };
  socket.send(JSON.stringify(message));
}

/**
 * Represents a message received from the server containing the current game code.
 */
export interface gameCode {
  /** The type (purpose) of the message sent or received */
  type: MessageType.SET_GAME_CODE;
  /** The data sent with the message containing the current lobby's game code. */
  data: {
    gameCode: string;
  };
}
