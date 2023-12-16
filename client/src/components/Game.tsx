/**
 * @fileoverview This file contains the Game component, which is responsible
 * for rendering the Slither+ game. It includes the game canvas and other
 * game-related UI elements.
 */

/**
 * @interface GameProps
 * Defines the props for the Game component.
 *
 * @property {string} gameCode - The unique code of the game currently being played. This code is used to differentiate between different game sessions.
 * @property {WebSocket} socket - The client's WebSocket instance used for real-time communication with the Slither+ server.
 */
interface GameProps {
  /** The game code of the game current being played */
  gameCode: string;
  /** The client's websocket for communication with the Slither+ server */
  socket: WebSocket;
}

/**
 * Game is a React Functional Component that renders the Slither+ game interface.
 * It includes the game canvas, leaderboard, user scores, and the game code of the current lobby.
 *
 * @param {GameProps} props - The props for the Game component.
 * @returns {JSX.Element} The JSX element representing the Slither+ game interface.
 */
export default function Game({ gameCode, socket }: GameProps) {
  return <div>{gameCode}</div>;
}
