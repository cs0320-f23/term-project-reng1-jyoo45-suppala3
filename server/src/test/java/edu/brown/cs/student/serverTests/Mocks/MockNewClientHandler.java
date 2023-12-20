package edu.brown.cs.student.serverTests.Mocks;

import edu.brown.cs.student.main.GameServer.MinesweeperServer;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.ClientAlreadyExistsException;
import edu.brown.cs.student.main.exceptions.IncorrectGameCodeException;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import org.java_websocket.WebSocket;

public class MockNewClientHandler {
  public User handleNewClientNoCode(Message message, MinesweeperServer server)
      throws MissingFieldException {
    if (!message.data().containsKey("username"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);
    User user = new User(message.data().get("username").toString());

    return user;
  }

  /**
   * Handles the process of creating a new client that specifies a game code. This is used for
   * clients attempting to join an existing game.
   *
   * @param message The message received from the client containing necessary data.
   * @param server The MinesweeperServer instance handling the connection.
   * @return The created User object for the new client.
   * @throws MissingFieldException if the message lacks necessary data (e.g., username or game
   *     code).
   * @throws ClientAlreadyExistsException if the client already exists on the server.
   * @throws IncorrectGameCodeException if the provided game code does not exist.
   */
  public User handleNewClientWithCode(
      Message message, MinesweeperServer server)
      throws MissingFieldException, IncorrectGameCodeException {

    if (!message.data().containsKey("username") || !message.data().containsKey("gameCode"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);

    User user = new User(message.data().get("username").toString());

    String gameCode = message.data().get("gameCode").toString();

    return user;
  }
}
