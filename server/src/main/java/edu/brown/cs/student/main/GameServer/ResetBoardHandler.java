package edu.brown.cs.student.main.GameServer;

import edu.brown.cs.student.main.GameState.GameState;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import java.util.Set;
import org.java_websocket.WebSocket;

/** UpdatePositionHandler class to allow for snake movement support */
public class ResetBoardHandler {

  /**
   * Activated when MinesweeperServer receives UPDATE_POSITION method to update for all users
   * (sharing the inputted gameState)
   *
   * @param thisUser : the user who is updating the board
   * @param message : the deserialized message from the client containing information about the cell
   *     clicked
   * @param gameState : the GameState corresponding to the game in which this UPDATE_POSITION
   *     message is being processed
   * @param webSocket : the WebSocket corresponding to the user who made the move
   * @param gameStateSockets : the set of WebSockets for this game so other users can be updated
   *     with this user's action
   * @param server : the server through which GameState updates are sent live to all users for
   *     synchronicity
   * @throws MissingFieldException if a cell clicked is not present in the message
   */
  public void handleBoardUpdate(
      User thisUser,
      Message message,
      GameState gameState,
      WebSocket webSocket,
      Set<WebSocket> gameStateSockets,
      MinesweeperServer server)
      throws MissingFieldException {
    if (!message.data().containsKey("GameCode"))
      throw new MissingFieldException(message, MessageType.ERROR);
    gameState.createNewGame();
  }
}
