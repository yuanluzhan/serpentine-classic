export const GRID_SIZE = 14;
export const INITIAL_DIRECTION = "right";

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function cloneSegments(segments) {
  return segments.map((segment) => ({ ...segment }));
}

function positionsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function isGameOver(state) {
  return state.gameOver;
}

export function createInitialState(options = {}) {
  const gridSize = options.gridSize ?? GRID_SIZE;
  const middle = Math.floor(gridSize / 2);
  const snake = cloneSegments(
    options.snake ?? [
      { x: middle, y: middle },
      { x: middle - 1, y: middle },
      { x: middle - 2, y: middle },
    ]
  );
  const direction = options.direction ?? INITIAL_DIRECTION;
  const queuedDirection = options.queuedDirection ?? direction;
  const score = options.score ?? 0;
  const food =
    options.food ??
    spawnFood(snake, gridSize, options.foodIndex ?? options.randomIndex);

  return {
    gridSize,
    snake,
    direction,
    queuedDirection,
    food,
    score,
    gameOver: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection] || state.gameOver) {
    return state;
  }

  const blockedDirection = OPPOSITE_DIRECTIONS[state.direction];
  if (nextDirection === blockedDirection) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection,
  };
}

export function spawnFood(occupiedCells, gridSize, selector = 0) {
  const occupiedKeys = new Set(
    occupiedCells.map((cell) => `${cell.x},${cell.y}`)
  );
  const availableCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupiedKeys.has(key)) {
        availableCells.push({ x, y });
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  let index = 0;
  if (typeof selector === "function") {
    index = selector(availableCells);
  } else if (typeof selector === "number") {
    index = selector;
  }

  const normalizedIndex =
    ((Math.floor(index) % availableCells.length) + availableCells.length) %
    availableCells.length;

  return availableCells[normalizedIndex];
}

export function stepGame(state, selector = 0) {
  if (state.gameOver) {
    return state;
  }

  const direction = state.queuedDirection ?? state.direction;
  const vector = DIRECTION_VECTORS[direction];
  const nextHead = {
    x: state.snake[0].x + vector.x,
    y: state.snake[0].y + vector.y,
  };

  const hitsWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.gridSize ||
    nextHead.y >= state.gridSize;

  if (hitsWall) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      gameOver: true,
    };
  }

  const grows = positionsEqual(nextHead, state.food);
  const bodyToCheck = grows ? state.snake : state.snake.slice(0, -1);
  const hitsSelf = bodyToCheck.some((segment) => positionsEqual(segment, nextHead));

  if (hitsSelf) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      gameOver: true,
    };
  }

  const nextSnake = [nextHead, ...cloneSegments(state.snake)];
  if (!grows) {
    nextSnake.pop();
  }

  const score = grows ? state.score + 1 : state.score;
  const food = grows
    ? spawnFood(nextSnake, state.gridSize, selector)
    : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    food,
    score,
    gameOver: false,
  };
}
