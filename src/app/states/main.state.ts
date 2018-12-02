import { MazeGame } from '../game';
import { Direction } from '../game.definitions';
import { PositionHelper } from '../helpers/position.helper';
import { PathFinder } from '../models/path-finder';

export class MainState extends Phaser.State {
  game: MazeGame;
  pathFinder: PathFinder;

  create() {
    this.time.events.loop(Phaser.Timer.SECOND / 10, this.moveUpdate, this);
    this.game.grid.createGrid(this.game);
    this.game.player.createPlayer(this.game);
    this.pathFinder = new PathFinder(this.game.grid, this.game.player);
    if (this.game.device.touch) this.game.input.addPointer();
  }

  update() {
    this.game.player.drawPlayer();
    if (this.game.isReseting) {
      this.game.reset();
      this.state.restart();
    }
  }

  private moveUpdate() {
    if (this.game.usePathFinder) this.pathFinder.update();
    this.handleMoveInput();
  }

  private handleMoveInput() {
    const dir = this.dirFromCursor() || this.dirFromTouch();
    if (!!dir) this.game.player.move(dir);
    // reset game if find target
    if (PositionHelper.equals(
      PositionHelper.getGamePosition(this.game.grid.cellSize, this.game.player.pos),
      this.game.grid.targetPosition,
    )) this.game.isReseting = true;
  }

  private dirFromTouch() {
    if (!this.game.device.touch) return null;
    return this.game.input.pointer1.isDown ? PositionHelper.directionFromTouchCanvasPosition(
      this.game,
      {
        canvasX: this.game.input.pointer1.worldX,
        canvasY: this.game.input.pointer1.worldY,
      },
    ) : null;
  }

  private dirFromCursor() {
    const cursor = this.input.keyboard.createCursorKeys();
    if (cursor.down.isDown) return Direction.DOWN;
    else if (cursor.up.isDown) return Direction.UP;
    else if (cursor.left.isDown) return Direction.LEFT;
    else if (cursor.right.isDown) return Direction.RIGHT;
    return null;
  }
}
