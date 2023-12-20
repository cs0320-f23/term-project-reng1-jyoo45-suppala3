package edu.brown.cs.student.serverTests.GameState;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.GameState.Cell;
import edu.brown.cs.student.main.GameState.GameState;
import java.util.HashSet;
import java.util.Set;

import java.util.concurrent.ThreadLocalRandom;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TestGameState {
  GameState gameState;

  /**
   * Setup method to instantiate GameCodeGenerator and a Set<String> of
   * the current game codes (as empty to start)
   */
  @BeforeEach
  public void setup() {
    this.gameState = new GameState(null, "ABCDEF", true);
  }

  /**
   * Ensures that the first click of the user is always an empty cell.
   * Ensure the last line of the .createNewBoard() method is commented out
   * because we do not have a running server
   */
  @Test
  public void testFirstClickEmpty(){
    boolean firstClickEmpty = true;

    for(int i=0; i<10000; i++) {
      int randomRow = ThreadLocalRandom.current().nextInt(0, 10);
      int randomCol = ThreadLocalRandom.current().nextInt(0, 10);
      this.gameState.createNewBoard(randomRow, randomCol);
      if(this.gameState.getBoard()[randomRow][randomCol].getVal() != 0) {
        firstClickEmpty = false;
      }
    }

    assertTrue(firstClickEmpty);
  }

  /**
   * Tests that custom board are always able to be generated with random number of rows,
   * cols, and mines so that there is no error in the mine creation or cell numbering
   * methods that causes infinite loops
   */
  @Test
  public void testCustomizeBoard(){
    for(int i=0; i<10000; i++) {
      int randomRows = ThreadLocalRandom.current().nextInt(4, 100);
      int randomCols = ThreadLocalRandom.current().nextInt(4, 100);
      int numMines = ThreadLocalRandom.current().nextInt(1, (randomRows * randomCols) - 9);
      this.gameState.customizeBoard(randomRows, randomCols, numMines);
    }
  }

  /**
   * Checks that flagging a cell is properly updated in the board and that it does not impact other
   * squares. Similarly, check that we can unflag the cell.
   */
  @Test
  public void testFlagBoard(){
    this.gameState.createNewBoard(0, 0);
    this.gameState.updateBoard(new Cell(2, 2, 0,true,  false), "flag");
    assertTrue(this.gameState.getBoard()[2][2].isFlagged());
    assertFalse(this.gameState.getBoard()[2][6].isFlagged());
    this.gameState.updateBoard(new Cell(2, 2, 0,true,  false), "flag");
    assertFalse(this.gameState.getBoard()[2][2].isFlagged());
  }
}
