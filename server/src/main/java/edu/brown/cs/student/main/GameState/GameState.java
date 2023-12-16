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
  private Cell[][] board;
  private final ArrayList<User> players;
  private int numMoves;
  private boolean gameOver;

  public GameState(MinesweeperServer minesweeperServer, String gameCode) {
    this.minesweeperServer = minesweeperServer;
    this.gameCode = gameCode;
    this.board = new Cell[10][10];
    this.players = new ArrayList<>();
    this.numMoves = 0;
    this.gameOver = false;
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
  public void sendBoardData(MessageType messageType) {
    Map<String, Object> boardData = new HashMap<>();
    boardData.put("board", this.board);
    boardData.put("gameOver", this.gameOver);
    String json = this.minesweeperServer.serialize(new Message(messageType, boardData));
    System.out.println(json);
    this.minesweeperServer.sendToAllGameStateConnections(this, json);
  }


  //TODO: Modify this to take in arguments to customize board
  /**
   *
   * @param startRow
   * @param startCol
   */
  public void createNewBoard(int startRow, int startCol) {
    this.board = new Cell[10][10];

    System.out.println("starting mine creation");
    int placedMines = 0;
    int mineCount = 5;
    while(placedMines < mineCount){
      int randRow = (int)Math.floor(Math.random() * board.length);
      int randCol = (int)Math.floor(Math.random() * board[0].length);
      if(this.board[randRow][randCol] != null || (Math.abs(randRow - startRow) <= 1 && Math.abs(randCol - startCol) <= 1))
        continue;
      this.board[randRow][randCol] = new Cell(randRow, randCol, -1, true, false);
      placedMines++;
    }

    System.out.println("populating neighboring cells");
    for(int i = 0; i < this.board.length; i++){
      for(int j = 0; j < this.board[0].length; j++){
        if(board[i][j] == null){
          board[i][j] = new Cell(i, j, calcSurroundingMines(i, j), true, false);
        }
      }
    }
    System.out.println("finished making board");
    this.sendBoardData(MessageType.CURRENT_BOARD);
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

  private void revealCells(int row, int col){
    if(row < 0 || row >= this.board.length || col < 0 || col >= this.board[0].length)
      return;
    else if(this.board[row][col].getVal() == -1){
      this.gameOver = true;
      for(int i = 0; i < this.board.length; i++){
        for(int j = 0; j < this.board[0].length; j++){
          this.board[i][j].setHidden(false);
        }
      }
    }
    else if (this.board[row][col].isHidden() && this.board[row][col].getVal() >= 0) {
      this.board[row][col].setHidden(false);
      if(this.board[row][col].getVal() == 0) {
        for (int i = -1; i <= 1; i++) {
          for (int j = -1; j <= 1; j++) {
            revealCells(row + i, col + j);
          }
        }
      }
    }
  }

  private void updateFlag(int row, int col){
    this.board[row][col].setFlagged();
  }

  public void updateBoard(Cell actionCell, String action){
    if(action.equals("reveal")){
      if(numMoves == 0)
        createNewBoard(actionCell.getRow(), actionCell.getCol());
      System.out.println(this.board[actionCell.getRow()][actionCell.getCol()].getVal());
      this.revealCells(actionCell.getRow(), actionCell.getCol());
      this.numMoves++;
      this.sendBoardData(MessageType.CURRENT_BOARD);
    }
    else if(action.equals("flag")){
      this.updateFlag(actionCell.getRow(), actionCell.getCol());
      this.sendBoardData(MessageType.CURRENT_BOARD);
    }

  }

  public void createNewGame(){
    Map<String, Object> boardData = new HashMap<>();
    this.createNewBoard(0,0);
    this.gameOver = false;
    this.numMoves = 0;
    this.sendBoardData(MessageType.RESTART_GAME);
  }
}
