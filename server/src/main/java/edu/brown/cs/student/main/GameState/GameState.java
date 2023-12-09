package edu.brown.cs.student.main.GameState;

import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import org.java_websocket.WebSocket;

public class GameState {

  private final MinesweeperServer minesweeperServer;
  private final String gameCode; // the game code corresponding to this GameState
  private final int[][] board;
  private final ArrayList<User> players;

  public GameState(MinesweeperServer minesweeperServer, String gameCode) {
    this.minesweeperServer = minesweeperServer;
    this.gameCode = gameCode;
    this.board = new int[10][10];
    this.players = new ArrayList<>();
  }

  /**
   * Adds a user to this game state
   *
   * @param user : the user to be added to this GameState
   */
  public void addUser(User user) {
    this.players.add(user);
  }

  /**
   * Sends the updated orb data (including newly-generated orbs) to all clients connected to this
   * GameState
   */
  public void sendBoardData() {
    Map<String, Object> boardData = new HashMap<>();
    boardData.put("board", this.board);
    String json = this.minesweeperServer.serialize(new Message(MessageType.UPDATE_BOARD, boardData));
    this.minesweeperServer.sendToAllGameStateConnections(this, json);
  }

  public void createNewBoard(
      User thisUser,
      WebSocket webSocket,
      Set<WebSocket> gameStateSockets,
      MinesweeperServer server) {
    Random rand = new Random();
    for (int i = 0; i < this.board.length; i++) {
      for (int j = 0; j < this.board[0].length; j++) {
        this.board[i][j] = rand.nextInt(10);
        ;
      }
    }
    this.sendBoardData();
  }
}
