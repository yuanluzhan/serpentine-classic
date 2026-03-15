import test from "node:test";
import assert from "node:assert/strict";

import {
  createInitialState,
  isGameOver,
  queueDirection,
  spawnFood,
  stepGame,
} from "../src/game.js";

test("snake moves one cell in the current direction", () => {
  const state = createInitialState({
    gridSize: 8,
    snake: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
    ],
    direction: "right",
    food: { x: 7, y: 7 },
  });

  const nextState = stepGame(state, 0);

  assert.deepEqual(nextState.snake, [
    { x: 4, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 3 },
  ]);
});

test("reverse direction input is ignored", () => {
  const state = createInitialState({
    direction: "right",
    queuedDirection: "right",
  });

  const nextState = queueDirection(state, "left");

  assert.equal(nextState.queuedDirection, "right");
});

test("eating food grows the snake and increments the score", () => {
  const state = createInitialState({
    gridSize: 8,
    snake: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
    ],
    direction: "right",
    food: { x: 4, y: 3 },
  });

  const nextState = stepGame(state, 0);

  assert.equal(nextState.score, 1);
  assert.equal(nextState.snake.length, 4);
  assert.deepEqual(nextState.snake[0], { x: 4, y: 3 });
});

test("food spawns only on empty cells", () => {
  const food = spawnFood(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    2,
    0
  );

  assert.deepEqual(food, { x: 1, y: 1 });
});

test("wall collision ends the game", () => {
  const state = createInitialState({
    gridSize: 4,
    snake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    direction: "right",
    food: { x: 0, y: 0 },
  });

  const nextState = stepGame(state, 0);

  assert.equal(isGameOver(nextState), true);
});

test("self collision ends the game", () => {
  const state = createInitialState({
    gridSize: 6,
    snake: [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
    ],
    direction: "down",
    food: { x: 5, y: 5 },
  });

  const nextState = stepGame(state, 0);

  assert.equal(isGameOver(nextState), true);
});

test("restart state returns to a fresh playable game", () => {
  const restarted = createInitialState({
    gridSize: 10,
    foodIndex: 0,
  });

  assert.equal(restarted.score, 0);
  assert.equal(isGameOver(restarted), false);
  assert.equal(restarted.snake.length, 3);
  assert.ok(restarted.food);
});
