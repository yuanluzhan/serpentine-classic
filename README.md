# Serpentine Classic

A lightweight browser implementation of the classic Snake game, built with plain HTML, CSS, and JavaScript. The project keeps the gameplay loop intentionally focused: grid-based movement, food collection, score tracking, game-over detection, and restart.

## Features

- Classic Snake movement on a fixed grid
- Score increases as the snake eats food
- Game over on wall collision or self-collision
- Keyboard controls with Arrow keys and `WASD`
- On-screen directional controls for touch devices
- Deterministic core game logic separated from rendering

## Project Structure

- [index.html](/Users/yuanluzhan/Desktop/test/index.html): page shell and UI elements
- [styles.css](/Users/yuanluzhan/Desktop/test/styles.css): minimal game styling
- [src/game.js](/Users/yuanluzhan/Desktop/test/src/game.js): pure game logic
- [src/main.js](/Users/yuanluzhan/Desktop/test/src/main.js): rendering, input handling, and tick loop
- [tests/game.test.js](/Users/yuanluzhan/Desktop/test/tests/game.test.js): core logic tests for movement, growth, collisions, food placement, and restart

## Getting Started

### Run locally

Serve the repository root with a simple local server:

```bash
cd /Users/yuanluzhan/Desktop/test
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

### Controls

- `Arrow` keys: move the snake
- `W`, `A`, `S`, `D`: move the snake
- `Restart`: start a new game after game over or during play
- On-screen buttons: mobile-friendly movement controls

## Testing

If Node.js is available, run:

```bash
npm test
```

This executes the dependency-free logic tests via the built-in Node test runner.

## Manual Verification Checklist

- The board, score, and initial food render on first load
- Arrow keys and `WASD` both control movement
- On-screen controls work on narrow/mobile layouts
- Eating food increases both score and snake length
- Wall collision ends the game
- Self-collision ends the game
- Restart resets score, snake position, and food placement
- Boundaries are solid; the snake does not wrap around

## Notes

- The project intentionally avoids external dependencies.
- There is no pause mode in this version; restart is the only session control.
