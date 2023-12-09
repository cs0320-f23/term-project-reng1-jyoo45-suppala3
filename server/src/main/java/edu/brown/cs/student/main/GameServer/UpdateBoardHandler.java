package edu.brown.cs.student.main.GameServer;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.GameState.Cell;
import edu.brown.cs.student.main.GameState.GameState;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import java.util.Map;
import java.util.Set;
import org.java_websocket.WebSocket;

/**
 * UpdatePositionHandler class to allow for snake movement support
 */
public class UpdateBoardHandler {

  /**
   * Activated when SlitherServer receives UPDATE_POSITION method to
   * update for all users (sharing the inputted gameState) where the
   * newly moved snake connected to the inputted webSocket is located
   *
   * @param thisUser : the user whose snake's position is being updated
   * @param message : the deserialized message from the client containing
   * information about the snake's new position (to be added) and old
   * position (to be removed)
   * @param gameState : the GameState corresponding to the game in which
   * this UPDATE_POSITION message is being processed
   * @param webSocket : the WebSocket corresponding to the user whose snake's
   * position is being updated
   * @param gameStateSockets : the set of WebSockets for this game so other
   * users can be updated with this user's snake position update
   * @param server : the server through which GameState updates are sent live
   * to all users for synchronicity
   * @throws MissingFieldException if both addData and removeData messages do not each contain an 'x' and 'y' field
   */
  public void handleBoardUpdate(User thisUser, Message message, GameState gameState, WebSocket webSocket, Set<WebSocket> gameStateSockets, MinesweeperServer server) throws MissingFieldException {
    if (!message.data().containsKey("cell"))
      throw new MissingFieldException(message, MessageType.ERROR);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Cell> jsonAdapter = moshi.adapter(Cell.class);
    Cell actionCell = jsonAdapter.fromJsonValue(message.data().get("cell"));
    if(actionCell == null)
      throw new MissingFieldException(message, MessageType.ERROR);
//    if ((!(cellData.containsKey("row") && cellData.containsKey("col") && cellData.containsKey("val") && cellData.containsKey("isHidden"))))
//      throw new MissingFieldException(message, MessageType.ERROR);
//    Cell actionCell = new Cell((Integer) cellData.get("row"), (Integer) cellData.get("col"), (Integer) cellData.get("val"), (Boolean) cellData.get("isHidden"));
    gameState.updateBoard(actionCell);

//    Map<String, Double> addData = (Map<String, Double>) message.data().get("add");
//    Map<String, Double> removeData = (Map<String, Double>) message.data().get("remove");
//    if ((!(addData.containsKey("x") && addData.containsKey("y"))) || (!(removeData.containsKey("x") && removeData.containsKey("y"))))
//      throw new MissingFieldException(message, MessageType.ERROR);
//    Position toAdd = new Position(addData.get("x"), addData.get("y"));
//    Position toRemove = new Position(removeData.get("x"), removeData.get("y"));
//    gameState.updateOwnPositions(thisUser, toAdd, toRemove);
//    gameState.updateOtherUsersWithPosition(thisUser, toAdd, toRemove, webSocket, gameStateSockets, server);
//
////    Thread t = new Thread(() -> gameState.collisionCheck(thisUser, toAdd, webSocket, gameStateSockets, server));
//    gameState.collisionCheck(thisUser, toAdd, webSocket, gameStateSockets, server);
////    t.start();
  }

}
