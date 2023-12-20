package edu.brown.cs.student.serverTests.Mocks;

import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.GameState.GameState;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import java.util.HashMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testng.Assert;

public class TestMockSocket {

  private GameState gameState;

  private MinesweeperServer server;
  private int port;
  @BeforeEach
  public void setupServer(){
    this.port = 0;
    this.server = new MinesweeperServer(this.port);
    this.gameState = new GameState(this.server, "0", true);
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
  public void testUpdateBoardHandler() {

  }


}

