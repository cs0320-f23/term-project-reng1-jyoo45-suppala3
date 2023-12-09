package edu.brown.cs.student.main.Message;

/**
 * MessageType enum to represent all message communication types (including those between the server
 * and client)
 */
public enum MessageType {
  NEW_CLIENT_NO_CODE,
  NEW_CLIENT_WITH_CODE,
  UPDATE_BOARD,
  SET_GAME_CODE,
  ERROR,
  SUCCESS,
  JOIN_ERROR,
  JOIN_SUCCESS
}