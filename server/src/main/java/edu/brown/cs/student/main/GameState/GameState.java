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
  private final Cell[][] board;
  private final ArrayList<User> players;

  public GameState(MinesweeperServer minesweeperServer, String gameCode) {
    this.minesweeperServer = minesweeperServer;
    this.gameCode = gameCode;
    this.board = new Cell[10][10];
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
    String json = this.minesweeperServer.serialize(new Message(MessageType.CURRENT_BOARD, boardData));
    System.out.println(json);
    this.minesweeperServer.sendToAllGameStateConnections(this, json);
  }

  public void createNewBoard(
      User thisUser,
      WebSocket webSocket,
      Set<WebSocket> gameStateSockets,
      MinesweeperServer server) {

    System.out.println("starting mine creation");
    int placedMines = 0;
    int mineCount = 10;
    while(placedMines < mineCount){
      int randRow = (int)Math.floor(Math.random() * board.length);
      int randCol = (int)Math.floor(Math.random() * board[0].length);
      if(this.board[randRow][randCol] != null)
        continue;
      this.board[randRow][randCol] = new Cell(randRow, randCol, -1, true);
      placedMines++;
    }

    System.out.println("populating neighboring cells");
    for(int i = 0; i < this.board.length; i++){
      for(int j = 0; j < this.board[0].length; j++){
        if(board[i][j] == null){
          board[i][j] = new Cell(i, j, calcSurroundingMines(i, j), true);
        }
      }
    }
    System.out.println("finished making board");
    this.sendBoardData();
  }

  private int calcSurroundingMines(int row, int col){
    int mineCount = 0;
    for(int i = -1; i <= 1; i++){
      for(int j = -1; j <= 1; j++){
        if(row + i < 0 || row + i >= this.board.length || col + j < 0 || col + j >= this.board[0].length
            || this.board[row + i][col + j] == null || this.board[row + i][col + j].getVal() != -1)
          continue;
        mineCount++;
      }
    }
    return mineCount;
  }

  public void updateBoard(Cell actionCell){
    this.board[actionCell.getRow()][actionCell.getCol()].setHidden(false);
    this.sendBoardData();
  }
}
