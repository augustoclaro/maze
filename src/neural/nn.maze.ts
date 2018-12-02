// import * as neural from 'neataptic';
import * as Promise from 'bluebird';
import * as R from 'ramda';
import * as neural from 'synaptic';
import * as uuid from 'uuid';
import { MazeGame } from '../app/game';
import { Directions, GAME } from '../app/game.constants';
import { Direction, ICanvasPosition, ICanvasSize, ISize } from '../app/game.definitions';
import { MazeHelper } from '../app/helpers/maze.helper';
import { PositionHelper } from '../app/helpers/position.helper';
import { PromiseHelper } from '../app/helpers/promise.helper';
import { WorkerHelper } from '../app/helpers/worker.helper';
import { Grid } from '../app/models/grid';
import { Player } from '../app/models/player';
import { Trainer } from '../app/models/trainer';
/*
  neural network format:
    input:
    [
      player game pos X / game size width,
      player game pox Y / game size height,
      // cellSize / max sqm size,
      // ...current cell walls def,
      ...walls definition faltten,
    ]

    output:
    [
      possibility of left,
      possibility of up,
      possibility of right,
      possibility of down,
    ]
*/
export class MazeNeuralNetwork {
  static instances = new Map<string, MazeNeuralNetwork>();

  static getGameInput(
    canvasSize: ICanvasSize,
    gameSize: ISize,
    grid: Grid,
    playerPos: ICanvasPosition,
    log = false,
  ): number[] {
    // const wallsDef = R.pipe(
    //   R.values,
    //   R.pluck('walls'),
    //   R.map(walls => R.map(dir => Number(walls[dir]), Directions)),
    //   walls => R.flatten<number>(walls),
    // )(grid.cells);
    const playerGamePos = PositionHelper.getGamePosition(grid.cellSize, playerPos);
    const currentCellId = PositionHelper.getUniqueId(playerGamePos);
    const currentCell = grid.cells[currentCellId];
    const currentWallsDef = R.map(dir => Number(currentCell.walls[dir]), Directions);
    const input = [];
    input.push(playerGamePos.x / gameSize.w);
    input.push(playerGamePos.y / gameSize.h);
    input.push(...grid.getWallsDefinitions());
    // input.push(...grid.getCellsFlags(playerGamePos));
    // if (log) console.log(input);
    return input;
    // return [
    //   playerPos.canvasX / canvasSize.width,
    //   playerPos.canvasY / canvasSize.height,
    //   grid.cellSize / GAME.MAX_SQM_SIZE,
    //   ...currentWallsDef,
    //   ...grid.getWallsDefinitions(),
    // ];
  }

  static getTrainingPar(
    canvasSize: ICanvasSize,
    gameSize: ISize,
    grid: Grid,
    playerPos: ICanvasPosition,
    dir: Direction,
  ): neural.Trainer.TrainingPair {
    return {
      input: MazeNeuralNetwork.getGameInput(canvasSize, gameSize, grid, playerPos),
      output: R.map(R.pipe(R.equals(dir), Number), Directions),
    };
  }

  // static nn = nn({ layers: [GAME.DEFAULT_SIZE.w, GAME.DEFAULT_SIZE.h] });
  id = uuid();
  nn: neural.Architect.Perceptron;
  trainData: neural.Trainer.TrainingPair[] = [];
  // game: MazeGame;
  // static gameInput: number[];

  constructor() {
    const numberOfDirections = Directions.length;
    const numberOfWalls =
      (GAME.DEFAULT_SIZE.h * GAME.DEFAULT_SIZE.w * numberOfDirections);
    const numberOfOtherParams = 2;
    const nInput = numberOfWalls + numberOfOtherParams;
    this.nn = new neural.Architect.Perceptron(
      nInput,
      nInput,
      numberOfDirections,
    );
    this.nn.trainer = new neural.Trainer(this.nn);
    MazeNeuralNetwork.instances.set(this.id, this);
  }

  addTrainData(
    canvasSize: ICanvasSize,
    gameSize: ISize,
    grid: Grid,
    playerPos: ICanvasPosition,
    dir: Direction,
  ) {
    this.trainData.push(
      MazeNeuralNetwork.getTrainingPar(canvasSize, gameSize, grid, playerPos, dir),
    );
  }

  addTrainigPair(pair: neural.Trainer.TrainingPair) {
    this.trainData.push(pair);
  }

  guess(
    canvasSize: ICanvasSize,
    gameSize: ISize,
    grid: Grid,
    playerPos: ICanvasPosition,
  ) {
    const input = MazeNeuralNetwork.getGameInput(
      canvasSize,
      gameSize,
      grid,
      playerPos,
    );
    // console.log(input);
    return this.nn.activate(input);
  }

  train(rate?: number) {
    const result = this.nn.trainer.train(this.trainData, {
      shuffle: true,
      // error: 0.1,
      // iterations: 20000,
      // cost: neural.Trainer.cost.cros,
      // log: 1,
      rate: 0.05,
    });
    // console.log(result);
    this.trainData = [];
  }

  initialTrain() {
    // const promises = [];
    for (let i = 0; i < 1000; i++) {
      this.accumulateTrainingData(1);
      // console.log('accumulated', i);
      this.train();
      // console.log('trained', i);
      // promises.push(new Promise(() => {
          // .then(() => );
        // console.log('accumulated', i);
        // return MazeNeuralNetwork.train();
        // console.log('trained', i, result);
        // resolve();
      // }));
    }
    console.log('finish training');
    // return PromiseHelper.runInSequence(promises);
    // setTimeout(this.initialTrain, 10000);
    // if (!!MazeNeuralNetwork.game && !MazeNeuralNetwork.gameInput) {
    //   MazeNeuralNetwork.gameInput = MazeNeuralNetwork.getGameInput(
    //     MazeNeuralNetwork.game,
    //     MazeNeuralNetwork.game,
    //     MazeNeuralNetwork.game.grid,
    //     MazeNeuralNetwork.game.player.pos,
    //   );
    //   console.log(MazeNeuralNetwork.gameInput);
    // }
    // setTimeout(() => {
    //   if (!!MazeNeuralNetwork.game) {
    //     MazeNeuralNetwork.accumulateTrainingData(100);
    //     MazeNeuralNetwork.train();
    //   }
    //   this.initialTrain();
    // }, 1000);
    // setTimeout(this.initialTrain, 100);
    // const worker = WorkerHelper.fromFunction(self => {
    //   self.addEventListener('message', (evt) => {
    //     const factory = evt.data;
    //     console.log('init training');
    //     factory.accumulateTrainingData(100);
    //     factory.train();
    //     self.postMessage(null);
    //   });
    // });
    // const scheduleTrain = () => worker.postMessage(MazeNeuralNetwork);
    // worker.addEventListener('message', scheduleTrain);
    // scheduleTrain();
  }

  private accumulateTrainingData(numberOfMazes: number) {
    const gameSize = GAME.DEFAULT_SIZE;
    const cellSize = 50;
    const wallHeight = cellSize / 10;
    const moveSpeed = cellSize / 10;
    const targetPosition = { x: gameSize.w - 1, y: gameSize.h - 1 };
    const pixels = MazeHelper.getWindowPixels(gameSize, cellSize, wallHeight);
    // const promises = [];
    for (let i = 0; i < numberOfMazes; i++) {
      // promises.push(new Promise(resolve => {
        const grid = new Grid(gameSize, cellSize, wallHeight, targetPosition);
        const player = new Player(moveSpeed, grid, pixels.size);
        const trainer = new Trainer(pixels.size, gameSize, grid, player, this);
        while (!trainer.update());
        // resolve();
      // }));
    }
    // return Promise.all(promises).then(() => console.log('finish acc'));
  }
}

// MazeNeuralNetwork.initialize();
// MazeNeuralNetwork.initialTrain();
