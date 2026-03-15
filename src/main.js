import { createInitialState, isGameOver, queueDirection, stepGame } from "./game.js";

const TICK_MS = 160;
const boardElement = document.querySelector("#game-board");
const scoreElement = document.querySelector("#score");
const statusElement = document.querySelector("#status");
const restartButton = document.querySelector("#restart-button");
const controlButtons = document.querySelectorAll("[data-direction]");

const keyToDirection = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  a: "left",
  A: "left",
  s: "down",
  S: "down",
  d: "right",
  D: "right",
};

let tickCount = 0;
let state = createInitialState({
  foodIndex: 0,
});

function createFoodSelector() {
  return () => {
    tickCount += 1;
    return tickCount;
  };
}

function renderBoard() {
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${state.gridSize}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${state.gridSize}, 1fr)`;

  const snakeMap = new Map(
    state.snake.map((segment, index) => [`${segment.x},${segment.y}`, index])
  );
  const foodKey = state.food ? `${state.food.x},${state.food.y}` : "";

  for (let y = 0; y < state.gridSize; y += 1) {
    for (let x = 0; x < state.gridSize; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const cellKey = `${x},${y}`;

      if (snakeMap.has(cellKey)) {
        cell.classList.add("cell--snake");
        if (snakeMap.get(cellKey) === 0) {
          cell.classList.add("cell--head");
        }
      } else if (cellKey === foodKey) {
        cell.classList.add("cell--food");
      }

      boardElement.append(cell);
    }
  }
}

function renderStatus() {
  scoreElement.textContent = String(state.score);
  statusElement.textContent = isGameOver(state)
    ? "Game over. Press Restart to play again."
    : "Use Arrow keys or WASD to move.";
}

function render() {
  renderBoard();
  renderStatus();
}

function resetGame() {
  tickCount = 0;
  state = createInitialState({
    foodIndex: 0,
  });
  render();
}

function handleDirectionInput(direction) {
  state = queueDirection(state, direction);
}

function advanceGame() {
  state = stepGame(state, createFoodSelector());
  render();
}

document.addEventListener("keydown", (event) => {
  const direction = keyToDirection[event.key];
  if (!direction) {
    return;
  }

  event.preventDefault();
  handleDirectionInput(direction);
});

restartButton.addEventListener("click", resetGame);

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleDirectionInput(button.dataset.direction);
  });
});

render();
window.setInterval(advanceGame, TICK_MS);
