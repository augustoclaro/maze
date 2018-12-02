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
    if (this.game.usePathFinder) {
      this.pathFinder = new PathFinder(this.game.grid, this.game.player);
    }
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
    const cursor = this.input.keyboard.createCursorKeys();
    if (cursor.down.isDown) this.game.player.move(Direction.DOWN);
    else if (cursor.up.isDown) this.game.player.move(Direction.UP);
    else if (cursor.left.isDown) this.game.player.move(Direction.LEFT);
    else if (cursor.right.isDown) this.game.player.move(Direction.RIGHT);
    // reset game if find target
    if (PositionHelper.equals(
      PositionHelper.getGamePosition(this.game.grid.cellSize, this.game.player.pos),
      this.game.grid.targetPosition,
    )) this.game.isReseting = true;
  }
}
