package edu.brown.cs.student.main.GameState;

/**
 * Represents a single cell in the Minesweeper game.
 * Each cell has a row and column index, a value, and states for being flagged or hidden.
 */
public class Cell {
  private int row;
  private int col;
  private int val;

  private boolean isFlagged;
  private boolean isHidden;

  /**
   * Constructs a Cell with specified row, column, value, hidden state, and flagged state.
   *
   * @param row The row index of the cell.
   * @param col The column index of the cell.
   * @param val The value of the cell (e.g., number of adjacent mines).
   * @param isHidden The initial hidden state of the cell.
   * @param isFlagged The initial flagged state of the cell.
   */
  public Cell(int row, int col, int val, boolean isHidden, boolean isFlagged){
    this.row = row;
    this.col = col;
    this.val = val;
    this.isHidden = isHidden;
    this.isFlagged = isFlagged;
  }

  /**
   * Gets the row index of this cell.
   *
   * @return The row index.
   */
  public int getRow() {
    return row;
  }

  /**
   * Sets the row index of this cell.
   *
   * @param row The row index to set.
   */
  public void setRow(int row) {
    this.row = row;
  }

  /**
   * Gets the column index of this cell.
   *
   * @return The column index.
   */
  public int getCol() {
    return col;
  }

  /**
   * Sets the column index of this cell.
   *
   * @param col The column index to set.
   */
  public void setCol(int col) {
    this.col = col;
  }

  /**
   * Gets the value of this cell.
   *
   * @return The value of the cell.
   */
  public int getVal() {
    return val;
  }

  /**
   * Sets the value of this cell.
   *
   * @param val The value to set.
   */
  public void setVal(int val) {
    this.val = val;
  }

  /**
   * Checks if this cell is hidden.
   *
   * @return true if the cell is hidden, false otherwise.
   */
  public boolean isHidden() {
    return this.isHidden;
  }

  /**
   * Sets the hidden state of this cell.
   *
   * @param hidden The hidden state to set.
   */
  public void setHidden(boolean hidden) {
    isHidden = hidden;
  }

  /**
   * Checks if this cell is flagged.
   *
   * @return true if the cell is flagged, false otherwise.
   */
  public boolean isFlagged(){return this.isFlagged;}

  /**
   * Toggles the flagged state of this cell.
   */
  public void setFlagged(){this.isFlagged = !this.isFlagged();}
}
