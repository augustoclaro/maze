import { MazeGame } from '../game';
import { GAME } from '../game.constants';
import { Direction, ICanvasPosition, IPosition } from '../game.definitions';
import { PositionHelper } from '../helpers/position.helper';
import { Grid } from './grid';

export class Player {
  playerGraphics: Phaser.Graphics;
  playerSize: number;
  pos: ICanvasPosition;

  constructor(
    public moveSpeed: number,
    private grid: Grid,
  ) {
    this.playerSize = grid.cellSize * .5;
    this.pos = PositionHelper.getCanvasPosition(
      grid,
      this.playerSize,
      { x: 0, y: 0 },
    );
  }

  createPlayer(game: MazeGame) {
    this.playerGraphics = game.add.graphics(0, 0);
  }

  move(dir: Direction) {
    const newPos = PositionHelper.movePosition(this.grid, this, dir);
    const newGamePos = PositionHelper.getGamePosition(this.grid.cellSize, newPos);
    const newCell = this.grid.cells[PositionHelper.getUniqueId(newGamePos)];
    if (!!newCell && !newCell.walls[GAME.WALL_FACING_DIRECTION[dir]]) this.pos = newPos;
    // this could also support moving pixels, not entire squares (using player.moveSpeed).
  }

  // returns direction to position, or null if already on position
  directionTo(pos: IPosition): Direction | null {
    const target = PositionHelper.getCanvasPosition(
      this.grid,
      this.playerSize,
      pos,
    );
    const offset = {
      x: target.canvasX - this.pos.canvasX,
      y: target.canvasY - this.pos.canvasY,
    };
    if (
      Math.abs(offset.x) < this.moveSpeed &&
      Math.abs(offset.y) < this.moveSpeed
    ) return null;
    let dir: Direction;
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > 0) dir = Direction.RIGHT;
      else dir = Direction.LEFT;
    } else {
      if (offset.y > 0) dir = Direction.DOWN;
      else dir = Direction.UP;
    }
    return dir;
  }

  drawPlayer() {
    if (!this.playerGraphics) return;
    this.playerGraphics.clear();
    this.playerGraphics.beginFill(0x32CD32, 1);
    this.playerGraphics.drawCircle(
      (this.playerSize / 2) + this.pos.canvasX,
      (this.playerSize / 2) + this.pos.canvasY,
      this.playerSize,
    );
  }

  destroy() {
    if (!!this.playerGraphics) this.playerGraphics.destroy();
  }
}
