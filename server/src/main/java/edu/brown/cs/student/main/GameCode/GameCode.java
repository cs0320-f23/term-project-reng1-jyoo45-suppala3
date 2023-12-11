package edu.brown.cs.student.main.GameCode;

import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.GameState.GameState;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import java.util.HashMap;
import java.util.Map;

/**
 * GameCode class to allow for operations on synchronizing game codes between users in identical
 * games
 */
public class GameCode {
  /**
   * Method to send the corresponding game code to all other users with a matching GameState
   *
   * @param gameCode : the game code to be sent to all users within the same game
   * @param gameState : the game state for which all users present within it will use a matching
   *     game code
   * @param minesweeperServer : the server through which to serialize and send the game code
   *     updating message to all users within the same game
   */
  public static void sendGameCode(
      String gameCode, GameState gameState, MinesweeperServer minesweeperServer) {
    Map<String, Object> map = new HashMap<String, Object>();
    map.put("gameCode", gameCode);
    Message message = new Message(MessageType.SET_GAME_CODE, map);
    String json = minesweeperServer.serialize(message);
    minesweeperServer.sendToAllGameStateConnections(gameState, json);
  }
}
