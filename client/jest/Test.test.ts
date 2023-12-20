import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import { RenderResult, render, screen } from "@testing-library/react";
import App from "../src/components/App";
import GameState from "../src/components/game/GameState";
import {
  CurrentBoardMessage,
  sendNewClientNoCodeMessage,
  sendNewClientWithCodeMessage,
  sendResetBoardMessage,
  sendCustomizeBoardMessage,
} from "../src/components/message/Message";
import {socket} from "../src/components/App"
import { createEmptyBoard } from "../src/components/GameBoard";



// describe("<REPL />", () => {
//   test("App mounts properly", () => {

//     render(<typeof REPL />);

//     // Get by h1
//     const h1 = wrapper.container.querySelector("h1");
//     expect(h1?.textContent).toBe("Vite + React");

//     // Get by text using the React testing library
//     const text = screen.getByText(
//       /Click on the Vite and React logos to learn more/i
//     );
//     expect(text.textContent).toBeTruthy();
//   });
// });

describe("GameBoard generation", () => {
  test("Mock generation of board without the backend, testing to see if we can access cell values", () => {
    // Define a mock function for the test
    const board = createEmptyBoard(10, 10, 10);

    let numMines = 0;
    for(let i = 0; i < 10; i++){
        for(let n = 0; n < 10; n++){
            if(board[i][n].val === -1){
                numMines++;
            }
        }
    }
    expect(numMines === 10);
  });

  test("Fuzz testing different board configs", () => {
    // Define a mock function for the test

    for(let k = 0; k < 50; k++){
        let ranRow = Math.random() * k + 1;
        let ranCol = Math.random() * k + 1;
        let ranMines = Math.random() * (k - 5) + 1;
        if(ranMines <= 0){
            ranMines = 1;
        }

        const board = createEmptyBoard(ranRow, ranCol, ranMines);

        //the board should have placed the correct number of mines 
        //in random places throughout
        let numMines = 0;
        for (let i = 0; i < ranRow; i++) {
          for (let n = 0; n < ranCol; n++) {
            if (board[i][n].val === -1) {
              numMines++;
            }
          }
        }

        expect(numMines === ranMines);
    }
    
  });


});
