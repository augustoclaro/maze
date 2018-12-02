import * as R from 'ramda';
import { MazeGame } from '../app/game';
import { Directions, GAME } from '../app/game.constants';
import { PositionHelper } from '../app/helpers/position.helper';
import { MazeNeuralNetwork } from './nn.maze';

export class MazeRunner {
  nn: MazeNeuralNetwork;

  constructor(public game: MazeGame) {
    this.nn = new MazeNeuralNetwork();
    this.nn.initialTrain();
  }

  update() {
    const output = this.nn.guess(
      this.game,
      this.game,
      this.game.grid,
      this.game.player.pos,
    );
    const dir = Directions[R.indexOf(Math.max(...output), output)];
    // start - prepare output for easier display
    const lower = Math.min(...output);
    output.forEach((v, i) => {
      output[i] -= lower;
    });
    while (R.all(v => v < 1, output)) {
      output.forEach((v, i) => {
        output[i] *= 10;
      });
    }
    // end
    // console.log(GAME.DIRECTION_LABELS_MAP[dir], output);
    this.game.player.move(dir);
    if (PositionHelper.equals(
      PositionHelper.getGamePosition(this.game.grid.cellSize, this.game.player.pos),
      this.game.grid.targetPosition,
    )) this.game.isReseting = true;
  }
}
