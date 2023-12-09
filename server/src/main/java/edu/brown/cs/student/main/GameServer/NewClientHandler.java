package edu.brown.cs.student.main.GameServer;

import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.ClientAlreadyExistsException;
import edu.brown.cs.student.main.exceptions.IncorrectGameCodeException;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import org.java_websocket.WebSocket;

public class NewClientHandler {

  public User handleNewClientNoCode(Message message, WebSocket websocket, MinesweeperServer server)
      throws MissingFieldException, ClientAlreadyExistsException {
    if (!message.data().containsKey("username"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);
    User user = new User(message.data().get("username").toString());
    boolean result = server.addWebsocketUser(websocket, user);
    if (!result) throw new ClientAlreadyExistsException(MessageType.JOIN_ERROR);
    return user;
  }

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
