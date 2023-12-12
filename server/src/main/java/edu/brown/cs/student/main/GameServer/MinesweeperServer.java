package edu.brown.cs.student.main.GameServer;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.GameCode.GameCode;
import edu.brown.cs.student.main.GameCode.GameCodeGenerator;
import edu.brown.cs.student.main.GameState.GameState;
import edu.brown.cs.student.main.Message.Message;
import edu.brown.cs.student.main.Message.MessageType;
import edu.brown.cs.student.main.User.User;
import edu.brown.cs.student.main.exceptions.ClientAlreadyExistsException;
import edu.brown.cs.student.main.exceptions.GameCodeNoGameStateException;
import edu.brown.cs.student.main.exceptions.GameCodeNoLeaderboardException;
import edu.brown.cs.student.main.exceptions.IncorrectGameCodeException;
import edu.brown.cs.student.main.exceptions.MissingFieldException;
import edu.brown.cs.student.main.exceptions.MissingGameStateException;
import edu.brown.cs.student.main.exceptions.SocketAlreadyExistsException;
import edu.brown.cs.student.main.exceptions.UserNoGameCodeException;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class MinesweeperServer extends WebSocketServer {
  private final Set<WebSocket> allConnections; // stores all connections
  private final Set<WebSocket>
      inactiveConnections; // stores connections for clients whose users are not actively playing
  private final Map<User, String>
      userToGameCode; // maps users to the game code for the game they are in
  private final Map<WebSocket, User>
      socketToUser; // maps websockets to the user associated with that connections
  private final Map<String, GameState>
      gameCodeToGameState; // maps game codes to game states (for the same game)
  private final Map<GameState, Set<WebSocket>>
      gameStateToSockets; // maps game states to all the websockets for users in that game

  public MinesweeperServer(int port) {
    super(new InetSocketAddress(port));
    this.allConnections = new HashSet<>();
    this.inactiveConnections = new HashSet<>();
    this.userToGameCode = new HashMap<>();
    this.socketToUser = new HashMap<>();
    this.gameCodeToGameState = new HashMap<>();
    this.gameStateToSockets = new HashMap<>();
  }

  public void sendToAllGameStateConnections(GameState gameState, String messageJson) {
    Set<WebSocket> gameSockets = this.gameStateToSockets.get(gameState);
    for (WebSocket webSocket : gameSockets) {
      webSocket.send(messageJson);
    }
  }

  /**
   * Serializes and returns a provided Message object into a JSON String.
   *
   * @param message - a Message: the Message object that needs to be serialized into a JSON String.
   * @return a String - the serialized Message object.
   */
  public String serialize(Message message) {
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Message> jsonAdapter = moshi.adapter(Message.class);
    return jsonAdapter.toJson(message);
  }

  /**
   * Takes a String message (msg) and a MessageType, and generates a Message object with this data.
   *
   * @param msg - a String: The String message that is to be included within the data field of the
   *     created Message object.
   * @param messageType - a MessageType: The type of the Message being created (the enum value for
   *     the type field of the created Message object).
   * @return a Message - created using the provided msg String and MessageType.
   */
  private Message generateMessage(String msg, MessageType messageType) {
    Map<String, Object> data = new HashMap<>();
    data.put("msg", msg);
    return new Message(messageType, data);
  }

  @Override
  public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
    System.out.println("server: onOpen called");
    this.allConnections.add(webSocket);
    this.inactiveConnections.add(webSocket);
    System.out.println(
        "server: New client joined - Connection from "
            + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    String jsonResponse =
        this.serialize(this.generateMessage("New socket opened", MessageType.SUCCESS));
    webSocket.send(jsonResponse);
  }

  @Override
  public void onClose(WebSocket webSocket, int code, String reason, boolean remote) {
    System.out.println("server: onClose called");
    User user = this.socketToUser.get(webSocket);
    if (user == null) return;
    this.allConnections.remove(webSocket);
    this.inactiveConnections.remove(webSocket);
    this.socketToUser.remove(webSocket);
    String gameCode = this.userToGameCode.get(user);
    if (gameCode == null) return;
    this.userToGameCode.remove(user);
    GameState gameState = this.gameCodeToGameState.get(gameCode);
    if (gameState == null) return;
    if (this.gameStateToSockets.get(gameState).size() == 1) {
      this.gameStateToSockets.get(gameState).remove(webSocket);
      this.gameStateToSockets.remove(gameState);
      gameState = null; // so that it gets garbage collected eventually
      this.gameCodeToGameState.remove(gameCode);
    } else {
      this.gameStateToSockets.get(gameState).remove(webSocket);
    }
  }

  @Override
  public void onMessage(WebSocket webSocket, String jsonMessage) {
    System.out.println("server: Message received from client: " + jsonMessage);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Message> jsonAdapter = moshi.adapter(Message.class);
    String jsonResponse;
    try {
      Message deserializedMessage = jsonAdapter.fromJson(jsonMessage);
      Thread t = new Thread(() -> handleOnMessage(webSocket, deserializedMessage));
      t.start();
    } catch (IOException e) {
      MessageType messageType =
          this.socketToUser.containsKey(webSocket) ? MessageType.ERROR : MessageType.JOIN_ERROR;
      jsonResponse =
          this.serialize(
              this.generateMessage(
                  "The server could not deserialize the client's message", messageType));
      webSocket.send(jsonResponse);
    }
  }

  @Override
  public void onError(WebSocket connection, Exception e) {
    if (connection != null) {
      this.allConnections.remove(connection);
      System.out.println(
          "server: An error occurred from: "
              + connection.getRemoteSocketAddress().getAddress().getHostAddress());
    }
  }

  @Override
  public void onStart() {
    System.out.println("server: Server started!");
  }

  public boolean addWebsocketUser(WebSocket webSocket, User user) {
    if (this.socketToUser.containsKey(webSocket)) return false;
    this.socketToUser.put(webSocket, user);
    return true;
  }

  public boolean addGameCodeToUser(String gameCode, User user) {
    if (this.userToGameCode.containsKey(user)) return false;
    this.userToGameCode.put(user, gameCode);
    return true;
  }

  public Set<String> getExistingGameCodes() {
    return this.gameCodeToGameState.keySet();
  }

  public boolean addSocketToGameState(String gameCode, WebSocket webSocket)
      throws MissingGameStateException {
    GameState gameState = this.gameCodeToGameState.get(gameCode);
    if (gameState == null || this.gameStateToSockets.get(gameState) == null)
      throw new MissingGameStateException(MessageType.JOIN_ERROR);
    if (this.gameStateToSockets.get(gameState).contains(webSocket)) return false;
    this.gameStateToSockets.get(gameState).add(webSocket);
    return true;
  }

  public void handleOnMessage(WebSocket webSocket, Message deserializedMessage) {
    String jsonResponse;
    try {
      switch (deserializedMessage.type()) {
        case NEW_CLIENT_NO_CODE -> { // create a new user and also make a new game code, GameState,
          // and Leaderboard for their new game.
          this.inactiveConnections.remove(webSocket);
          User newUser =
              new NewClientHandler().handleNewClientNoCode(deserializedMessage, webSocket, this);
          String gameCode = new GameCodeGenerator().generateGameCode(this.getExistingGameCodes());
          this.gameCodeToGameState.put(gameCode, new GameState(this, gameCode));
          this.gameCodeToGameState.get(gameCode).addUser(newUser);
          this.gameStateToSockets.put(this.gameCodeToGameState.get(gameCode), new HashSet<>());
          this.userToGameCode.put(newUser, gameCode);
          boolean result = this.addSocketToGameState(gameCode, webSocket);

          if (!result) throw new SocketAlreadyExistsException(MessageType.JOIN_ERROR);

          GameCode.sendGameCode(gameCode, this.gameCodeToGameState.get(gameCode), this);

          GameState gameState = this.gameCodeToGameState.get(gameCode);
          gameState.createNewBoard(0, 0);

          Message message =
              this.generateMessage("New client added to new game", MessageType.JOIN_SUCCESS);
          message.data().put("gameCode", gameCode);
          jsonResponse = this.serialize(message);
          webSocket.send(jsonResponse);
          break;
        }
        case NEW_CLIENT_WITH_CODE -> { // create a new user and add them to the provided game code
          // if it is valid.
          this.inactiveConnections.remove(webSocket);
          User newUser =
              new NewClientHandler().handleNewClientWithCode(deserializedMessage, webSocket, this);
          // throw errors if the desired game code, Leaderboard, or GameState do not already exist
          String existingGameCode = this.userToGameCode.get(newUser);
          if (existingGameCode == null) {
            throw new UserNoGameCodeException(MessageType.JOIN_ERROR);
          }
          if (this.gameCodeToGameState.get(existingGameCode) == null) {
            throw new GameCodeNoLeaderboardException(MessageType.JOIN_ERROR);
          }
          if (!this.gameCodeToGameState.containsKey(this.userToGameCode.get(newUser)))
            throw new GameCodeNoGameStateException(MessageType.JOIN_ERROR);

          this.addSocketToGameState(existingGameCode, webSocket);
          this.gameCodeToGameState.get(existingGameCode).addUser(newUser);
          GameState gameState = this.gameCodeToGameState.get(this.userToGameCode.get(newUser));
          gameState.createNewBoard(0, 0);

          GameCode.sendGameCode(
              existingGameCode, this.gameCodeToGameState.get(existingGameCode), this);

          Message message =
              this.generateMessage(
                  "New client added to existing game code", MessageType.JOIN_SUCCESS);
          message.data().put("gameCode", this.userToGameCode.get(newUser));
          jsonResponse = this.serialize(message);
          webSocket.send(jsonResponse);
          break;
        }
        case UPDATE_BOARD -> { // update the board based on action
          // on which this message was received
          User user = this.socketToUser.get(webSocket);
          String gameCode = this.userToGameCode.get(user);
          if (gameCode == null)
            throw new UserNoGameCodeException(MessageType.ERROR);
          GameState gameState = this.gameCodeToGameState.get(gameCode);
          if (gameState == null)
            throw new GameCodeNoGameStateException(MessageType.ERROR);

          Thread t = new Thread(() -> {
            try {
              new UpdateBoardHandler().handleBoardUpdate(user, deserializedMessage, gameState, webSocket, this.gameStateToSockets.get(gameState), this);
            } catch (MissingFieldException e) {
              String res = this.serialize(this.generateMessage("The message sent by the client was missing a required field", e.messageType));
              webSocket.send(res);
            }
          });
          t.start();
          break;
        }
        //TODO
        case RESTART_GAME -> {
          // Restart the game for the specified game code
          String gameCode = deserializedMessage.data().get("gameCode").toString();
          GameState gameState = this.gameCodeToGameState.get(gameCode);

          // Add your logic to restart the game
          gameState.createNewBoard(0, 0);

          // Optionally, send a message back to the clients to inform them about the restart
          // You can customize this based on your communication protocol
          Message restartMessage = generateMessage("Restarted game", MessageType.RESTART_GAME);
          String restart = serialize(restartMessage);
          sendToAllGameStateConnections(gameState, restart);
          break;
        }
        default -> {
          MessageType messageType =
              this.socketToUser.containsKey(webSocket) ? MessageType.ERROR : MessageType.JOIN_ERROR;
          jsonResponse =
              this.serialize(
                  this.generateMessage(
                      "The message sent by the client had an unexpected type", messageType));
          webSocket.send(jsonResponse);
          break;
        }
      }
    } catch (MissingFieldException e) {
      jsonResponse =
          this.serialize(
              this.generateMessage(
                  "The message sent by the client was missing a required field", e.messageType));
      webSocket.send(jsonResponse);
    } catch (ClientAlreadyExistsException e) {
      jsonResponse =
          this.serialize(
              this.generateMessage("Tried to add a client that already exists", e.messageType));
      webSocket.send(jsonResponse);
    } catch (IncorrectGameCodeException e) {
      jsonResponse =
          this.serialize(
              this.generateMessage("The provided gameCode was incorrect", e.messageType));
      webSocket.send(jsonResponse);
    } catch (UserNoGameCodeException e) {
      jsonResponse =
          this.serialize(
              this.generateMessage("User had no corresponding game code", e.messageType));
      webSocket.send(jsonResponse);
    } catch (GameCodeNoGameStateException e) {
      jsonResponse =
          this.serialize(
              this.generateMessage("Game code had no corresponding game state", e.messageType));
      webSocket.send(jsonResponse);
    } catch (GameCodeNoLeaderboardException e) {
      jsonResponse =
          this.serialize(
              this.generateMessage("Game code had no corresponding leaderboard", e.messageType));
      webSocket.send(jsonResponse);
    } catch (SocketAlreadyExistsException e) {
      jsonResponse =
          this.serialize(this.generateMessage("This socket already exists", e.messageType));
      webSocket.send(jsonResponse);
    } catch (MissingGameStateException e) {
      jsonResponse =
          this.serialize(this.generateMessage("Game state cannot be found", e.messageType));
      webSocket.send(jsonResponse);
    }
  }

  /**
   * Main method for the MinesweeperServer class. Used to instantiate an object of the MinesweeperServer
   * class and get it to listen for WebSocket connections on port 9000.
   *
   * @param args - a String array: arguments provided to the main method (unused in this case).
   */
  public static void main(String args[]) {
    final int port = 9000;
    new MinesweeperServer(port).start();
  }
}
