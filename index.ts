// tslint:disable:ordered-imports
import 'phaser-ce/build/custom/p2.js';
import 'phaser-ce/build/custom/pixi.js';
import 'phaser-ce/build/custom/phaser-split.js';
// tslint:enable:ordered-imports
import { MazeGame } from './src/app/game';
import { GAME } from './src/app/game.constants';

window.onload = () => {
  new MazeGame(GAME.DEFAULT_SIZE);
};
