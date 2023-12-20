package edu.brown.cs.student.serverTests.Mocks;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.GameState.Cell;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.exceptions.MissingFieldException;

public class MockUpdateBoardHandler {
  /**
   * Activated when MinesweeperServer receives UPDATE_POSITION method to update for all users
   * (sharing the inputted gameState)
   *
   * @param message : the deserialized message from the client containing information about the cell
   *     clicked
   * @param gameState : the GameState corresponding to the game in which this UPDATE_POSITION
   *     message is being processed
   * @param server : the server through which GameState updates are sent live to all users for
   *     synchronicity
   * @throws MissingFieldException if a cell clicked is not present in the message
   */
  public void handleBoardUpdate(
      Message message,
      MockGameState gameState,
      MinesweeperServer server)
      throws MissingFieldException {
    if (!message.data().containsKey("cell") || !message.data().containsKey("action"))
      throw new MissingFieldException(message, MessageType.ERROR);

    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Cell> jsonAdapter = moshi.adapter(Cell.class);
    Cell actionCell = jsonAdapter.fromJsonValue(message.data().get("cell"));

    JsonAdapter<String> jsonAdapter2 = moshi.adapter(String.class);
    String action = jsonAdapter2.fromJsonValue(message.data().get("action"));

    if (actionCell == null) throw new MissingFieldException(message, MessageType.ERROR);
    gameState.updateBoard(actionCell, action);
  }

}
