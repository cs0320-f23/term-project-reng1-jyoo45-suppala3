package edu.brown.cs.student.main.exceptions;

import edu.brown.cs.student.main.Message.MessageType;

/** Custom exception for when Socket already exist. */
public class SocketAlreadyExistsException extends Exception {

  public final MessageType messageType; // the MessageType to be sent to the client in the failure response

  /**
   * Constructor for the SocketAlreadyExistsException class.
   *
   * @param messageType - a MessageType: the MessageType to be sent to the client in the failure
   *     response.
   */
  public SocketAlreadyExistsException(MessageType messageType) {
    this.messageType = messageType;
  }
}
