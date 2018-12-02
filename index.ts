// tslint:disable:ordered-imports
import 'phaser-ce/build/custom/p2.js';
import 'phaser-ce/build/custom/pixi.js';
import 'phaser-ce/build/custom/phaser-split.js';
// tslint:enable:ordered-imports
import * as R from 'ramda';
import { MazeGame } from './src/app/game';
import { GAME } from './src/app/game.constants';
import { MazeNeuralNetwork } from './src/neural/nn.maze';

let games: MazeGame[] = [];
// let training = false;

function train() {
  const container = document.getElementById(GAME.CONTAINER_ID);
  container.innerHTML = '';
  const addTrainerGame = () => {
    const gameEl = document.createElement('div');
    gameEl.classList.add('game-container');
    container.appendChild(gameEl);
    games = R.concat(games, [new MazeGame(GAME.DEFAULT_SIZE, gameEl, true)]);
  };
  for (let i = 0; i < 2; i++) addTrainerGame();
  const clearEl = document.createElement('div');
  clearEl.style.clear = 'both';
  container.appendChild(clearEl);
  document.getElementById('bt_train').onclick = btTrainAction;
  document.onkeyup = (evt) => {
    if (evt.which === 27) {
      R.forEach(g => g.isReseting = true, games);
    }
  };
}

const destroyGames = () => R.forEach(g => g.destroy(), games);

const btTrainAction = () => {
  R.forEach(g => g.paused = true, games);
  setTimeout(() => {
    MazeNeuralNetwork.instances.forEach(nn => nn.initialTrain());
    // MazeNeuralNetwork.initialTrain();
    R.forEach(g => g.paused = false, games);
  }, 0);
};

const createMainGame = () => {
  destroyGames();
  const container = document.getElementById(GAME.CONTAINER_ID);
  container.style.width = window.innerWidth + 'px';
  container.style.height = window.innerHeight + 'px';
  container.innerHTML = '';
  games = [new MazeGame(GAME.DEFAULT_SIZE, container, true)];
  document.getElementById('bt_train').onclick = btTrainAction;
};

window.onload = train;

window.ondblclick = () => {
  // if (training) {
  //   R.forEach(g => g.paused = false, games);
  //   // createMainGame();
  // } else {
  //   R.forEach(g => g.paused = true, games);
  //   MazeNeuralNetwork.initialTrain();
  //   R.forEach(g => g.paused = false, games);
  //   // games = [];
  //   // train();
  // }
  // training = !training;
};
