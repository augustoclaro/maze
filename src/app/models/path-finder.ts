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
      const dir = this.player.directionTo(nextCell);
      if (!dir) {
        // we are already on next cell
        this.visited[PositionHelper.getUniqueId(nextCell)] = true;
        return this.update();
      }
      this.player.move(dir);
    }
  }
}
