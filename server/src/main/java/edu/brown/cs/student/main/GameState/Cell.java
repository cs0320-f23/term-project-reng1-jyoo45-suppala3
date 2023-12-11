package edu.brown.cs.student.main.GameState;

public class Cell {
  private int row;
  private int col;
  private int val;
  private boolean isHidden;
  public Cell(int row, int col, int val, boolean isHidden){
    this.row = row;
    this.col = col;
    this.val = val;
    this.isHidden = isHidden;
  }

  public int getRow() {
    return row;
  }

  public void setRow(int row) {
    this.row = row;
  }

  public int getCol() {
    return col;
  }

  public void setCol(int col) {
    this.col = col;
  }

  public int getVal() {
    return val;
  }

  public void setVal(int val) {
    this.val = val;
  }

  public boolean isHidden() {
    return isHidden;
  }

  public void setHidden(boolean hidden) {
    isHidden = hidden;
  }
}
