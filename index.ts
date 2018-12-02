// tslint:disable:ordered-imports
import 'phaser-ce/build/custom/p2.js';
import 'phaser-ce/build/custom/pixi.js';
import 'phaser-ce/build/custom/phaser-split.js';
// tslint:enable:ordered-imports
import { MazeGame } from './src/app/game';
import { GAME } from './src/app/game.constants';

window.onload = () => {
  let game: MazeGame;
  let usePathFinder = false;
  let mazeSize = GAME.DEFAULT_SIZE;
  function startGame() {
    if (!!game) game.destroy();
    // I set game to null first, so it'll be overwritten
    // even if MazeGame construction fails
    game = null;
    game = new MazeGame(mazeSize, usePathFinder);
  }
  startGame();
  // manage path finder
  document.querySelector('#btn-toggle-pathfinder').addEventListener('click', () => {
    usePathFinder = !usePathFinder;
    game.usePathFinder = usePathFinder;
  });
  // customize size
  const mazeSizeSelector = document.querySelector<HTMLInputElement>('#maze-size');
  mazeSizeSelector.addEventListener('change', () => {
    mazeSize = { w: Number(mazeSizeSelector.value), h: Number(mazeSizeSelector.value) };
    startGame();
  });
};
