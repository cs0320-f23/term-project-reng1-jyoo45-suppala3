package edu.brown.cs.student.main.GameState;

public class Cell {
  private int row;
  private int col;
  private int val;

  private boolean isFlagged;
  private boolean isHidden;
  public Cell(int row, int col, int val, boolean isHidden, boolean isFlagged){
    this.row = row;
    this.col = col;
    this.val = val;
    this.isHidden = isHidden;
    this.isFlagged = isFlagged;
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
    return this.isHidden;
  }

  public void setHidden(boolean hidden) {
    isHidden = hidden;
  }

  public boolean isFlagged(){return this.isFlagged;}

  public void setFlagged(){this.isFlagged = !this.isFlagged();}
}
