package edu.brown.cs.student.main.exceptions;

import edu.brown.cs.student.main.Message.MessageType;

public class SocketAlreadyExistsException extends Exception {

  public final MessageType messageType;

  public SocketAlreadyExistsException(MessageType messageType) {
    this.messageType = messageType;
  }
}
