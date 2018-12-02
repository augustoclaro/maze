# maze
Maze game, featuring random maze generation and maze solver. Eventually, I'll write neural networks on top of it. Initial tries are on `neural-network` branch.

Using Phaser-CE + TypeScript.

Run instructions:
Clone repository, `npm install` packages, and run with `npm start`

To see pathfinder playing for you, pass `true` to second argument of `new MazeGame` on index.ts. Example: `new MazeGame(GAME.DEFAULT_SIZE, true);`

You can change maze size on game.constants.ts on `DEFAULT_SIZE` constant. Remember to change the game container size on game.scss to make enough room to your huge mazes, or you can see an exception thrown.
