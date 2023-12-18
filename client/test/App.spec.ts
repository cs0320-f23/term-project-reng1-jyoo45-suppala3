import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

test("on page load, I see an input bar for username", async ({ page }) => {
  await expect(page.locator('input[type="text"]:first-of-type')).toBeVisible();
});

test("username input should accept text", async ({ page }) => {
  const usernameInput = page.locator('input[type="text"]:first-of-type');
  await usernameInput.fill("TestUser");
  await expect(usernameInput).toHaveValue("TestUser");
});

test("display error for empty username on game creation", async ({ page }) => {
  await page.click('button:text("Create a new game")');
  await expect(page.locator("p")).toHaveText(
    "Your username should be non-empty!"
  );
});

test("input bar for game code should be visible", async ({ page }) => {
  await expect(
    page.locator('input[placeholder="Enter gamecode here:"]')
  ).toBeVisible();
});

test("game code input should accept text", async ({ page }) => {
  const gameCodeInput = page.locator(
    'input[placeholder="Enter gamecode here:"]'
  );
  await gameCodeInput.fill("12345");
  await expect(gameCodeInput).toHaveValue("12345");
});

test("join game with code and expect error", async ({ page }) => {
  await page.locator('input[type="text"]:first-of-type').fill("TestUser");
  const gameCodeInput = page.locator(
    'input[placeholder="Enter gamecode here:"]'
  );
  await gameCodeInput.fill("12345");
  await page.click('button:text("Join with a game code")');
  await expect(page.locator("p")).toHaveText("Error: Failed to join the game!");
});

test("when I join the game, I see a board", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.locator(".minesweeper-board").isVisible();
});

test("When I click a cell, it reveals it", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.locator(".cell").first().click();
  // check that the number of hidden cells is not 100? to ensure that a cell is revealed
});

test("When I input a command to reveal a cell, it reveals it", async ({
  page,
}) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.getByPlaceholder("start typing command...").click();
  await page.getByPlaceholder("start typing command...").fill("reveal 0 0");
  await page.getByPlaceholder("start typing command...").press("Enter");
  // check that the number of hidden cells is not 100? to ensure that a cell is revealed
});

test("restart game button resets the game", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.locator(".cell").first().click();
  await page.getByRole("button", { name: "Restart Game!" }).click();
  //check that the number of hidden cell is 100
});

test("restart game button resets the game", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.getByRole("button", { name: "Customize" }).click();
  await page.getByPlaceholder("Rows").click();
  await page.getByPlaceholder("Rows").fill("20");
  await page.getByPlaceholder("Columns").click();
  await page.getByPlaceholder("Columns").fill("20");
  await page.getByRole("button", { name: "Submit" }).nth(1).click();
  //check that the number of hidden cell is 400 or that the board size is 400?
});

test("help button shows the instruction of how to play the game", async ({
  page,
}) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.getByRole("button", { name: "Help" }).click();
  await page
    .getByText(
      "Welcome to our version of minesweeper, where you can play single player or multi"
    )
    .isVisible();
});

test("right click displays a flag", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.locator(".cell").first().click({
    button: "right",
  });
  //displays a flag? show that the number of hiddens do not change possibly?
});

test("right click displays a flag", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByRole("button", { name: "Create a new game" }).click();
  await page.locator(".cell").first().click({
    button: "right",
  });
  //displays a flag? show that the number of hiddens do not change possibly?
});
