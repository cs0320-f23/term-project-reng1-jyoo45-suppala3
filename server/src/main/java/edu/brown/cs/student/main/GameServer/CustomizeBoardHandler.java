package edu.brown.cs.student.main.GameServer;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.GameState.Cell;
import edu.brown.cs.student.main.GameState.GameState;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import java.util.Set;
import org.java_websocket.WebSocket;

public class CustomizeBoardHandler {
  public void handleBoardCustomization(
      User thisUser,
      Message message,
      GameState gameState,
      WebSocket webSocket,
      Set<WebSocket> gameStateSockets,
      MinesweeperServer server)
      throws MissingFieldException {
    System.out.println(message.data());
    if (!message.data().containsKey("rows") || !message.data().containsKey("cols") || !message.data().containsKey("mines"))
      throw new MissingFieldException(message, MessageType.ERROR);

    int rows = ((Double) message.data().get("rows")).intValue();
    int cols = ((Double) message.data().get("cols")).intValue();
    int mines = ((Double) message.data().get("mines")).intValue();

    if(mines >= rows * cols)
      throw new MissingFieldException(message, MessageType.ERROR);

    gameState.customizeBoard(rows, cols, mines);
  }
}
