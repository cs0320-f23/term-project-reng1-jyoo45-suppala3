package edu.brown.cs.student.main.GameServer;

import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.ClientAlreadyExistsException;
import edu.brown.cs.student.main.exceptions.IncorrectGameCodeException;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import org.java_websocket.WebSocket;

/**
 * Handles the creation of new clients in the Minesweeper game. This class includes methods for
 * processing new client requests both with and without game codes.
 */
public class NewClientHandler {

  /**
   * Handles the process of creating a new client that does not specify a game code.
   *
   * @param message The message received from the client containing necessary data.
   * @param websocket The WebSocket connection of the client.
   * @param server The MinesweeperServer instance handling the connection.
   * @return The created User object for the new client.
   * @throws MissingFieldException if the message lacks necessary data (e.g., username).
   * @throws ClientAlreadyExistsException if the client already exists on the server.
   */
  public User handleNewClientNoCode(Message message, WebSocket websocket, MinesweeperServer server)
      throws MissingFieldException, ClientAlreadyExistsException {
    if (!message.data().containsKey("username"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);
    User user = new User(message.data().get("username").toString());
    boolean result = server.addWebsocketUser(websocket, user);
    if (!result) throw new ClientAlreadyExistsException(MessageType.JOIN_ERROR);
    return user;
  }

  /**
   * Handles the process of creating a new client that specifies a game code. This is used for
   * clients attempting to join an existing game.
   *
   * @param message The message received from the client containing necessary data.
   * @param websocket The WebSocket connection of the client.
   * @param server The MinesweeperServer instance handling the connection.
   * @return The created User object for the new client.
   * @throws MissingFieldException if the message lacks necessary data (e.g., username or game
   *     code).
   * @throws ClientAlreadyExistsException if the client already exists on the server.
   * @throws IncorrectGameCodeException if the provided game code does not exist.
   */
  public User handleNewClientWithCode(
      Message message, WebSocket websocket, MinesweeperServer server)
      throws MissingFieldException, ClientAlreadyExistsException, IncorrectGameCodeException {
    if (!message.data().containsKey("username") || !message.data().containsKey("gameCode"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);
    User user = new User(message.data().get("username").toString());
    String gameCode = message.data().get("gameCode").toString();
    if (!server.getExistingGameCodes().contains(gameCode))
      throw new IncorrectGameCodeException(MessageType.JOIN_ERROR);
    boolean result = server.addWebsocketUser(websocket, user);
    if (!result) throw new ClientAlreadyExistsException(MessageType.JOIN_ERROR);
    server.addGameCodeToUser(gameCode, user);
    return user;
  }
}
