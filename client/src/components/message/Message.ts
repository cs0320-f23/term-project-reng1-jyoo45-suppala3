import { Cell } from "../GameBoard";
import MessageType from "./MessageType";

/**
 * The default generic interface for any message sent or received to
 * the Slither+ server.
 */
export default interface Message {
  /** The type (purpose) of the message sent or received */
  type: MessageType;
  /** The data sent as part of the message */
  data: any;
}

/**
 * An interface representing a message sent to the server registering
 * the client for a new game, with no specified game code.
 */
export interface NewClientNoCodeMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.NEW_CLIENT_NO_CODE;
  /** The data sent with the message - the client's username */
  data: {
    username: string;
  };
}

/**
 * An interface representing a message sent to the server registering
 * the client for a presently running game, with a specified game code.
 */
export interface NewClientOldCodeMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.NEW_CLIENT_WITH_CODE;
  /**
   * The data sent with the message - the client's username and
   * specified game code for the lobby to join
   */
  data: {
    username: string;
    gameCode: string;
  };
}

/**
 * An interface representing a message sent to the server registering
 * the client for a presently running game, with a specified game code.
 */
export interface UpdateBoardMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.UPDATE_BOARD;
  /**
   * The data sent with the message - the client's username and
   * specified game code for the lobby to join
   */
  data: {
    cell: Cell;
    action: string;
  };
}

/**
 * An interface representing a message sent to the server for resetting a 
 * running game (the board should be regenerated, but the socket threads
 * should remain the same)
 */
export interface ResetBoardMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.RESTART_GAME;
  /**
   * The data sent with the message - the client's username and
   * specified game code for the lobby to join
   */
  data: {
    GameCode: string;
  };
}


/**
 * An interface representing a message sent to the server registering
 * the client for a presently running game, with a specified game code.
 */
export interface CurrentBoardMessage {
  /** The type (purpose) of the message sent or received */
  type: MessageType.CURRENT_BOARD;
  /**
   * The data sent with the message - the client's username and
   * specified game code for the lobby to join
   */
  data: {
    board: Cell[][];
    gameOver: boolean;
  };
}


/**
 * Sends a message to the server via the given websocket to register
 * the client for a new game.
 * @param socket the client's websocket for communication with the server
 * @param username the client's username
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
 * Sends a message to the server via the given websocket to register
 * the client for a joining a game with the given game code.
 * @param socket the client's websocket for communication with the server
 * @param username the client's username
 * @param gameCode the game code of the lobby to join
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
 * Sends a message to the server via the given websocket to update the
 * current client's position across all other clients.
 * @param socket the client's websocket for communication with the server
 * @param add the position of the segment of the snake to add
 * @param remove the position of the segment of the snake to remove
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
 * Sends a message to the server via the given websocket to reset
 * the board- activated when any user in the game hits reset game
 * @param socket the client's websocket for communication with the server
 * @param add the position of the segment of the snake to add
 * @param remove the position of the segment of the snake to remove
 */
export function sendResetBoardMessage(socket: WebSocket, gameCode:string): void {
  const message: ResetBoardMessage = {
    type: MessageType.RESTART_GAME,
    data: {
      GameCode: gameCode,
    },
  };
  socket.send(JSON.stringify(message));
}

/**
 * An interface representing a message received from the server to pass along
 * the current lobby's game code.
 */
export interface gameCode {
  /** The type (purpose) of the message sent or received */
  type: MessageType.SET_GAME_CODE;
  /** The data sent with the message - the current lobby's game code */
  data: {
    gameCode: string;
  };
}