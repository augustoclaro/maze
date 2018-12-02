import * as R from 'ramda';
import { MazeNeuralNetwork } from '../../neural/nn.maze';
import { Direction, ICanvasSize, ICellsMap, IPosition, ISize } from '../game.definitions';
import { MazeHelper } from '../helpers/maze.helper';
import { PositionHelper } from '../helpers/position.helper';
import { Grid } from './grid';
import { Player } from './player';

export class PathFinder {
  visited: ICellsMap<boolean> = {};
  path: IPosition[];
  foundTarget: boolean = false;

  constructor(
    private canvasSize: ICanvasSize,
    private gameSize: ISize,
    private grid: Grid,
    private player: Player,
  ) {
    this.path = MazeHelper.findPath(
      grid.cells,
      PositionHelper.getGamePosition(grid.cellSize, this.player.pos),
      grid.targetPosition,
    );
  }

  update() {
    const nextCell = R.find(p => !this.visited[PositionHelper.getUniqueId(p)], this.path);
    if (!!nextCell) {
      const playerGamePos = PositionHelper.getGamePosition(this.grid.cellSize, this.player.pos);
      if (PositionHelper.equals(playerGamePos, nextCell)) {
        this.visited[PositionHelper.getUniqueId(nextCell)] = true;
        return this.update();
      }
      const nextCanvasPos = PositionHelper.getCanvasPosition(
        this.grid,
        this.player.playerSize,
        nextCell,
      );
      const neighbors = PositionHelper.getNeighbors(this.grid.cells, playerGamePos);
      const dir = R.find(
        d => PositionHelper.equals(nextCell, neighbors[d]),
        R.keys(neighbors),
      );
      const movementTrainData = MazeNeuralNetwork.getTrainingPar(
        this.canvasSize,
        this.gameSize,
        this.grid,
        this.player.pos,
        dir,
      );
      this.player.pos = nextCanvasPos;
      if (
        PositionHelper.equals(
          PositionHelper.getGamePosition(this.grid.cellSize, nextCanvasPos),
          this.grid.targetPosition,
        )
      ) this.foundTarget = true;
      this.visited[PositionHelper.getUniqueId(nextCell)] = true;
      return movementTrainData;
      // const dir = this.player.directionTo(nextCell);
      // if (!dir) {
      //   this.visited[PositionHelper.getUniqueId(nextCell)] = true;
      //   return this.update();
      // }
      // MazeNeuralNetwork.addTrainData(
      //   this.canvasSize,
      //   this.gameSize,
      //   this.grid,
      //   this.player.pos,
      //   dir,
      // );
      // this.player.move(dir);
    }
  }
}
