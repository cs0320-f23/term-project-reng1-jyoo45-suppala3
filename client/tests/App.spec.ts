import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

test("username input should accept text", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("TestUser");
  await page.getByLabel("Create Game Button").click();
});

test("username field should not be empty", async ({ page }) => {
  await page.getByLabel("Create Game Button").click();
  await page.getByLabel("error-text").click();
  await expect(page.getByTestId("error-text")).toHaveText(
    "Your username should be non-empty!"
  );
});

test("game code input should accept text", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("TestUser");
  await page.getByPlaceholder("Enter gamecode here:").click();
  await page.getByPlaceholder("Enter gamecode here:").fill("12345");
  await page.getByLabel("Join Game Button").click();
});

test("join game with code and expect error", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").fill("TestUser");
  await page.getByPlaceholder("Enter gamecode here:").fill("12345");
  await expect(page.getByTestId("error-text")).toHaveText(" ");
});

test("when I join the game, I see a board", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await expect(page.locator(".minesweeper-board")).toBeVisible();
});

test("When I click a cell, it reveals it", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await page.locator(".cell").first().click();
  // check that the number of hidden cells is not 100? to ensure that a cell is revealed
});

test("When I input a command to reveal a cell, it reveals it", async ({
  page,
}) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await page.getByPlaceholder("start typing command...").click();
  await page.getByPlaceholder("start typing command...").fill("reveal 0 0");
  await page.getByPlaceholder("start typing command...").press("Enter");
  // check that the number of hidden cells is not 100? to ensure that a cell is revealed
});

test("restart game button resets the game", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await page.locator(".cell").first().click();
  await page.getByLabel("Restart").click();
  //check that the number of hidden cell is 100
});

test("Customize board should change board size", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await page.getByLabel("Customize").click();
  await page.getByPlaceholder("Rows").fill("20");
  await page.getByPlaceholder("Columns").fill("20");
  await page.getByLabel("Submit").click();
  // Verify the board has been customized? somehow access the row value of the minesweeper-board? or that the hidden cells are 400?
});

test("help button shows the instruction of how to play the game", async ({
  page,
}) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await page.getByLabel("Help").click();
  await expect(
    page.getByText(
      "Welcome to our version of minesweeper, where you can play single player or multi"
    )
  ).toBeVisible();
});

test("right click displays a flag", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("user");
  await page.getByLabel("Create Game Button").click();
  await page.locator(".cell").first().click({
    button: "right",
  });
  //displays a flag? show that the number of hiddens do not change possibly?
});

test("Game over should be displayed on hitting a mine", async ({ page }) => {
  await page.getByPlaceholder("Type your username here:").click();
  await page.getByPlaceholder("Type your username here:").fill("testUser");
  await page.getByLabel("Create Game Button").click();
  await page.getByLabel("Customize").click();
  await page.getByPlaceholder("Rows").fill("3");
  await page.getByPlaceholder("Columns").fill("2");
  await page.getByPlaceholder("Mines").fill("1");
  await page.getByLabel("Submit").click();
  await page.locator(".cell").first().click();
  await page.locator(".row > div:nth-child(2)").first().click();
  await page
    .locator(".minesweeper-board > div:nth-child(2) > div")
    .first()
    .click();
  await page
    .locator(".minesweeper-board > div:nth-child(2) > div:nth-child(2)")
    .click();
  await page.locator("div:nth-child(3) > div").first().click();
  await page.locator("div:nth-child(3) > div:nth-child(2)").click();
  await expect(page.getByText("GAME OVER")).toBeVisible();
});
