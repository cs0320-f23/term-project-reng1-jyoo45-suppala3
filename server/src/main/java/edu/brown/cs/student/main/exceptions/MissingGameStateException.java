package edu.brown.cs.student.main.exceptions;

import edu.brown.cs.student.main.Message.MessageType;

/** Custom exception for when an expected GameState does not exist. */
public class MissingGameStateException extends Exception {

  public final MessageType
      messageType; // the MessageType to be sent to the client in the failure response

  /**
   * Constructor for the MissingGameStateException class.
   *
   * @param messageType - a MessageType: the MessageType to be sent to the client in the failure
   *     response.
   */
  public MissingGameStateException(MessageType messageType) {
    this.messageType = messageType;
  }
}
