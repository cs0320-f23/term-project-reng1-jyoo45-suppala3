package edu.brown.cs.student.serverTests.Mocks;

import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.GameState.Cell;
import edu.brown.cs.student.main.User.User;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents the state of a specific Minesweeper game, including the game board, the players, and
 * the game status.
 */
public class MockGameState {

  private Cell[][] board;
  private final ArrayList<User> players;
  private int numMoves;
  private int numRows;
  private int numCols;
  private int numMines;
  private int numHidden;
  /**
   * Constructs a new GameState associated with a MinesweeperServer and a specific game code.
   *
   * @param minesweeperServer The MinesweeperServer instance managing this game.
   * @param gameCode The unique game code associated with this game state.
   */
  public MockGameState(MinesweeperServer minesweeperServer, String gameCode, boolean mock) {
    this.numRows = 10;
    this.numCols = 10;
    this.numMines = 5;
    this.board = new Cell[10][10];
    this.players = new ArrayList<>();
    this.numMoves = 0;
    this.numHidden = this.numRows * this.numCols;
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
   * Creates a new game board with specified starting row and column. Initializes the board with
   * mines and calculates the numbers for each cell.
   *
   * @param startRow The starting row for the player.
   * @param startCol The starting column for the player.
   */
  public void createNewBoard(int startRow, int startCol) {
    this.board = new Cell[this.numRows][this.numCols];
    this.numHidden = this.numRows * this.numCols;

//    System.out.println("starting mine creation");
    int placedMines = 0;
    while (placedMines < this.numMines) {
      int randRow = (int) Math.floor(Math.random() * board.length);
      int randCol = (int) Math.floor(Math.random() * board[0].length);
      if (this.board[randRow][randCol] != null
          || (Math.abs(randRow - startRow) <= 1 && Math.abs(randCol - startCol) <= 1)) continue;
      this.board[randRow][randCol] = new Cell(randRow, randCol, -1, true, false, false);
      placedMines++;
    }

//    System.out.println("populating neighboring cells");
    for (int i = 0; i < this.board.length; i++) {
      for (int j = 0; j < this.board[0].length; j++) {
        if (board[i][j] == null) {
          board[i][j] = new Cell(i, j, calcSurroundingMines(i, j), true, false, false);
        }
      }
    }
//    System.out.println("finished making board");

  }

  /**
   * Helper method to calculate the surrounding mine numbers
   *
   * @param row
   * @param col
   * @return
   */
  private int calcSurroundingMines(int row, int col) {
    int mineCount = 0;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        if (row + i < 0
            || row + i >= this.board.length
            || col + j < 0
            || col + j >= this.board[0].length
            || this.board[row + i][col + j] == null
            || this.board[row + i][col + j].getVal() != -1) continue;
        mineCount++;
      }
    }
    return mineCount;
  }

  /**
   * Helper method to reveal cells as necessary
   *
   * @param row
   * @param col
   */
  private void revealCells(int row, int col) {
    if (row < 0 || row >= this.board.length || col < 0 || col >= this.board[0].length) return;
    else if (this.board[row][col].getVal() == -1) {
      this.revealBoard();
    } else if (this.board[row][col].isHidden() && this.board[row][col].getVal() >= 0) {
      if(!board[row][col].isFlagged()){
        this.board[row][col].setHidden(false);
        this.numHidden--;
      }
      if (this.board[row][col].getVal() == 0) {
        for (int i = -1; i <= 1; i++) {
          for (int j = -1; j <= 1; j++) {
            revealCells(row + i, col + j);
          }
        }
      }
    }
    if (this.numHidden == this.numMines){
      this.revealBoard();
    }
  }

  private void revealBoard(){
    for (int i = 0; i < this.board.length; i++) {
      for (int j = 0; j < this.board[0].length; j++) {
        this.board[i][j].setHidden(false);
      }
    }
  }

  /**
   * Helper method to show flag icon when right clicked
   *
   * @param row
   * @param col
   */
  private void updateFlag(int row, int col) {
    this.board[row][col].setFlagged();
  }

  /**
   * Updates the board based on the action performed on a specific cell. This can be either
   * revealing a cell or flagging a cell.
   *
   * @param actionCell The cell on which the action is performed.
   * @param action The action to be performed ("reveal" or "flag").
   */
  public void updateBoard(Cell actionCell, String action) {
    if (action.equals("reveal")) {
      if (numMoves == 0) createNewBoard(actionCell.getRow(), actionCell.getCol());
      System.out.println(this.board[actionCell.getRow()][actionCell.getCol()].getVal());
      this.revealCells(actionCell.getRow(), actionCell.getCol());
      this.numMoves++;
    } else if (action.equals("flag")) {
      this.updateFlag(actionCell.getRow(), actionCell.getCol());
    }
    else if(action.equals("highlight")){
      this.board[actionCell.getRow()][actionCell.getCol()].setHighlighted(true);
    }
    else if(action.equals("unhighlight")){
      this.board[actionCell.getRow()][actionCell.getCol()].setHighlighted(false);
    }
  }

  /** Resets the game to a new state, creating a new game board and resetting game parameters. */
  public void createNewGame() {
    Map<String, Object> boardData = new HashMap<>();
    this.createNewBoard(0, 0);
    this.numMoves = 0;
  }

  public void customizeBoard(int numRows, int numCols, int numMines) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.numMines = numMines;
    this.createNewBoard(0, 0);
  }

  public Cell[][] getBoard(){
    return this.board;
  }
}

