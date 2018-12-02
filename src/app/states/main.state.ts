import { MazeRunner } from '../../neural/maze.runner';
import { MazeNeuralNetwork } from '../../neural/nn.maze';
import { MazeGame } from '../game';
import { Direction } from '../game.definitions';
import { PathFinder } from '../models/path-finder';
import { Trainer } from '../models/trainer';

export class MainState extends Phaser.State {
  game: MazeGame;
  // trainer: Trainer;
  // pathFinder: PathFinder;

  create() {
    this.time.events.loop(Phaser.Timer.SECOND / 10, this.moveUpdate, this);
    if (this.game.useNN) {
      this.game.grid.createGrid(this.game);
      this.game.player.createPlayer(this.game);
      // this.pathFinder = new PathFinder(this.game, this.game, this.game.grid, this.game.player);
    } else {
      // this.trainer = new Trainer(this.game, this.game.grid, this.game.player);
      // this.trainer.start();
    }
  }

  update() {
    if (this.game.useNN) {
      this.game.player.drawPlayer();
    } else {
      // let trained = false;
      // while (!trained) {
      //   this.trainer.update();
      //   if (this.game.isReseting) {
      //     trained = true;
      //     break;
      //   }
      // }
    }
    if (this.game.isReseting) {
      this.game.reset();
      this.state.restart();
    }
  }

  private moveUpdate() {
    if (this.game.useNN) {
      this.game.mazeRunner.update();
      // this.pathFinder.update();
      // if (this.pathFinder.foundTarget) this.game.isReseting = true;
      this.handleMoveInput();
    }
  }

  private handleMoveInput() {
    const cursor = this.input.keyboard.createCursorKeys();
    if (cursor.down.isDown) this.game.player.move(Direction.DOWN);
    else if (cursor.up.isDown) this.game.player.move(Direction.UP);
    else if (cursor.left.isDown) this.game.player.move(Direction.LEFT);
    else if (cursor.right.isDown) this.game.player.move(Direction.RIGHT);
  }
}
