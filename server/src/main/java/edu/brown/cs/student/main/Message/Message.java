package edu.brown.cs.student.main.Message;

import java.util.Map;

/**
 * Message record for transferring data between the server and client
 *
 * <p>Contains MessageType in order to denote the type of message to be dealt with (and thus the
 * procedure that this message should be processed by)
 *
 * <p>Contains Map<String, Object> to store all relevant data with regards to the operations that
 * will be performed on a message of its MessageType
 */
public record Message(MessageType type, Map<String, Object> data) {}
