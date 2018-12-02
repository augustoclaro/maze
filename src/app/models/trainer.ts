import { MazeNeuralNetwork } from '../../neural/nn.maze';
import { ICanvasSize, ISize } from '../game.definitions';
import { PositionHelper } from '../helpers/position.helper';
import { Grid } from './grid';
import { PathFinder } from './path-finder';
import { Player } from './player';

export class Trainer {
  pathFinder: PathFinder = new PathFinder(
    this.canvasSize,
    this.gameSize,
    this.grid,
    this.player,
  );

  constructor(
    private canvasSize: ICanvasSize,
    private gameSize: ISize,
    private grid: Grid,
    private player: Player,
    private nn?: MazeNeuralNetwork,
  ) {}

  update() {
    const movementTrainData = this.pathFinder.update();
    const playerPos = PositionHelper.getGamePosition(this.grid.cellSize, this.player.pos);
    if (!!movementTrainData && !!this.nn) {
      this.nn.addTrainigPair(movementTrainData);
    }
    return PositionHelper.equals(playerPos, this.grid.targetPosition);
  }
}
