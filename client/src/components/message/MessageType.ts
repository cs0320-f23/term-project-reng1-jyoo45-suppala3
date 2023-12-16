/**
 * A enum for the possible messages sent and received to the our Minesweeper game
 * server via a websocket.
 */
enum MessageType {
    NEW_CLIENT_NO_CODE = "NEW_CLIENT_NO_CODE",
    NEW_CLIENT_WITH_CODE = "NEW_CLIENT_WITH_CODE",
    UPDATE_BOARD = "UPDATE_BOARD",
    CURRENT_BOARD = "CURRENT_BOARD",
    SET_GAME_CODE = "SET_GAME_CODE",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    JOIN_ERROR = "JOIN_ERROR",
    RESTART_GAME = "RESTART_GAME",
    JOIN_SUCCESS = "JOIN_SUCCESS",
  }
  
  export default MessageType;