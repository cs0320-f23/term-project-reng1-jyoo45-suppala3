# term-project-reng1-jyoo45-suppala3--

# Collaborative Minesweeper

Our final project is a full-stack developed Collaborative Minesweeper Game, a multiplayer adaptation of the classic logic game Minesweeper.

The team members to this project were jyoo45, reng1, suppala3.

We spent around 12 hours a week on working on this project during the term project period.

# Features

- Multiplayer Gameplay: Join games with others
  or play solo.
- Customizable Game Boards: Set your own number of rows, columns, and mines.
- Real-Time Updates: Game state updates in real time for all players in a game.
- WebSocket Communication: Utilizes WebSocket for efficient client-server communication.
- Game Code System: Join games using unique game codes.

# Get Started

1. Install Dependencies: Navigate to the client directory and install the necessary Node.js packages.

```
cd client
npm install
```

2. Start the Server: Compile and run the Java server from the server directory. This is the main method on the MinesweeperServer.java file under the server package.

```
cd ../server
javac MinesweeperServer.java
```

3. Run the Client: In a new terminal, start the client application.

```
cd ../client
npm start
```

The client will be accessible at http://localhost:3000 in your web browser. You can then start playing a game by entering your username and creating a new game. More players can join by entering the GameCode which is displayed at the top of the screen of the user who created the game.

# Gameplay

- Start a Game: Click 'Create a new game' or join an existing game using a game code.
- Game Controls: Left-click to reveal a cell, right-click to flag a cell as a mine.
- Customize Board: Click 'Customize' to set the board size and number of mines.
- Restart Game: Use the 'Restart Game' button to reset the board.
- Use the input field to write commands such as reveal [row] [col] or flag [row] [col] (with spaces) to play the game solely with the keyboard!
- Click the Help button for more information.

# Technology Stack

- Frontend: React.js, HTML, CSS
- Backend: Java (WebSocket for real-time communication)
- Deployment: Localhost (both server and client)

# Design Choices

We have separated our program into the frontend (client) and backend (server), aligning with modern web application architecture. This separation enhances maintainability, scalability, and functionality.

## Client:

The frontend is responsible for presenting the game interface to the user. It handles user inputs, displays the game board, and shows real-time updates of the game state. It's developed using technologies like React.js, HTML, and CSS, offering a dynamic and responsive user experience.

The frontend establishes a WebSocket connection with the server. This connection is used to send player actions to the server and receive updates about the game state.

The client captures player actions (like revealing or flagging a cell) and sends these as messages to the server. It immediately updates the UI to reflect player actions, providing instant feedback while waiting for server confirmation. The client listens for messages from the server, which include updates to the game state, such as changes in the board after a cell is revealed or flagged. It then updates the UI based on these messages to ensure that the player always sees the current state of the game.

By focusing primarily on user interaction and display, the frontend remains decoupled from the game logic. This separation simplifies the development and debugging of user interface components.

## Server

The server is the central for game rules and logic. It validates player actions (like revealing a cell), updates the game state, and checks for win/loss conditions.

The server manages the state of the game, including the positions of mines, the state of each cell (hidden, revealed, flagged), and player turns. When it receives an action from a player, it updates the game state accordingly and then broadcasts the new state to all players in the game.

The server uses WebSockets to communicate with clients in real-time. It handles incoming messages (like a player's move), processes them, and sends back responses (like updated board state). The server manages player sessions and game instances, allowing multiple games to occur simultaneously. It handles players joining and leaving games, creating new game instances, and maintaining individual game sessions.

WebSockets are used in the collaborative Minesweeper game to enable real-time, bi-directional communication between the clients (players) and the server. This is crucial for multiplayer gameplay, where actions of one player need to be immediately reflected on the game boards of other players. Here's how WebSockets facilitate this:
