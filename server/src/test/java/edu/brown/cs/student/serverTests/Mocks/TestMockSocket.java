package edu.brown.cs.student.serverTests.Mocks;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.GameState.Cell;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import java.util.HashMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testng.Assert;

public class TestMockSocket {

  private MockGameState mockGameState;

  private MinesweeperServer server;
  private int port;
  @BeforeEach
  public void setupServer(){
    this.port = 0;
    this.server = new MinesweeperServer(this.port);
    this.mockGameState = new MockGameState(this.server, "0", false);

    for(int i = 0; i < 10; i++){
      for(int n = 0; n < 10; n++){
        this.mockGameState.getBoard()[i][n] = new Cell(0,0,0, true, false, false);
      }
    }
  }
  @Test
  public void testNewClientHandler() throws MissingFieldException {
    HashMap<String, Object> data = new HashMap<>();
    MockNewClientHandler clientHandler = new MockNewClientHandler();

    //this should fail as we need a username
    Message message = new Message(MessageType.NEW_CLIENT_NO_CODE, data);
    Assert.assertThrows(MissingFieldException.class, () -> clientHandler.handleNewClientNoCode(message, this.server));


    //should be successful
    data.put("username", "hello");
    Assert.assertEquals(clientHandler.handleNewClientNoCode(message, this.server).getUsername(), "hello");

    //this should error because the argument also needs a code
    Message messageTwo = new Message(MessageType.NEW_CLIENT_WITH_CODE, data);
    Assert.assertThrows(MissingFieldException.class, () -> clientHandler.handleNewClientWithCode(messageTwo, this.server));

    //now should work
    data.put("gameCode", "0");
    Message messageThree = new Message(MessageType.NEW_CLIENT_WITH_CODE, data);
    Assert.assertEquals(clientHandler.handleNewClientNoCode(message, this.server).getUsername(), "hello");
  }

  @Test
  public void testUpdateBoardHandlerFlag() throws MissingFieldException {
    HashMap<String, Object> data = new HashMap<>();
    MockUpdateBoardHandler boardHandler = new MockUpdateBoardHandler();

    //this should fail as we need args for the cell and action
    Message message = new Message(MessageType.UPDATE_BOARD, data);
    Assert.assertThrows(MissingFieldException.class, () -> boardHandler.handleBoardUpdate(message, this.mockGameState, this.server));


    Cell cell = new Cell(0, 0, 0, false, false, false);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Cell> jsonAdapter = moshi.adapter(Cell.class);
    Object serializedCell = jsonAdapter.toJsonValue(cell);

    //should be successful
    data.put("cell", serializedCell);

    JsonAdapter<String> jsonAdapter2 = moshi.adapter(String.class);
    Object serializedText = jsonAdapter2.toJsonValue("flag");
    data.put("action", serializedText);

    //the state of isFlagged should change
    Assert.assertEquals(mockGameState.getBoard()[0][0].isFlagged(), false);
    boardHandler.handleBoardUpdate(message, this.mockGameState, this.server);
    Assert.assertEquals(mockGameState.getBoard()[0][0].isFlagged(), true);

    //We can toggle back if the same message is sent again
    boardHandler.handleBoardUpdate(message, this.mockGameState, this.server);
    Assert.assertEquals(mockGameState.getBoard()[0][0].isFlagged(), false);
  }

  /**
   * Testing the reveal of cells
   * @throws MissingFieldException- for handling the case if the arguments in our message are bad
   */
  @Test
  public void testUpdateBoardHandlerReveal() throws MissingFieldException {
    HashMap<String, Object> data = new HashMap<>();
    MockUpdateBoardHandler boardHandler = new MockUpdateBoardHandler();


    //this should fail as we need args for the action too
    Message message = new Message(MessageType.UPDATE_BOARD, data);

    Cell cell = new Cell(0, 0, 0, true, false, false);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Cell> jsonAdapter = moshi.adapter(Cell.class);
    Object serializedCell = jsonAdapter.toJsonValue(cell);

    data.put("cell", serializedCell);
    Assert.assertThrows(MissingFieldException.class, () -> boardHandler.handleBoardUpdate(message, this.mockGameState, this.server));

    //should be successful now that we have an action too
    JsonAdapter<String> jsonAdapter2 = moshi.adapter(String.class);
    Object serializedText = jsonAdapter2.toJsonValue("reveal");
    data.put("action", serializedText);

    //the state of isHidden should change
    Assert.assertEquals(mockGameState.getBoard()[0][0].isHidden(), true);
    boardHandler.handleBoardUpdate(message, this.mockGameState, this.server);
    Assert.assertEquals(mockGameState.getBoard()[0][0].isHidden(), false);

  }


}

