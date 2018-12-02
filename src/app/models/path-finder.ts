import * as R from 'ramda';
import { ICellsMap, IPosition } from '../game.definitions';
import { MazeHelper } from '../helpers/maze.helper';
import { PositionHelper } from '../helpers/position.helper';
import { Grid } from './grid';
import { Player } from './player';

export class PathFinder {
  visited: ICellsMap<boolean> = {};
  path: IPosition[];

  constructor(
    private grid: Grid,
    private player: Player,
  ) {
    this.setPathToTarget();
  }

  update() {
    // const unvisitedPath = R.filter(p => !this.visited[PositionHelper.getUniqueId(p)], this.path);
    const playerGamePos = PositionHelper.getGamePosition(this.grid.cellSize, this.player.pos);
    const isPlayerIn = R.curry(PositionHelper.equals)(playerGamePos);
    const currentPositionOnPath = R.findIndex(isPlayerIn, this.path);
    if (currentPositionOnPath === -1) {
      this.setPathToTarget();
      return this.update();
    }
    let nextCell: IPosition;
    for (let i = 0; i < this.path.length; i++) {
      const step = this.path[i];
      this.visited[PositionHelper.getUniqueId(step)] = i <= currentPositionOnPath;
      if (i === currentPositionOnPath + 1) nextCell = step;
    }
    if (!!nextCell) {
      if (PositionHelper.equals(playerGamePos, nextCell)) {
        this.visited[PositionHelper.getUniqueId(nextCell)] = true;
        return this.update();
      }
      const dir = this.player.directionTo(nextCell);
      if (!dir) {
        // we are already on next cell
        this.visited[PositionHelper.getUniqueId(nextCell)] = true;
        return this.update();
      }
      this.player.move(dir);
    }
  }

  private setPathToTarget() {
    this.path = MazeHelper.findPath(
      this.grid.cells,
      PositionHelper.getGamePosition(this.grid.cellSize, this.player.pos),
      this.grid.targetPosition,
    );
  }
}
