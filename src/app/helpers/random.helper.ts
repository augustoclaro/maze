import * as R from 'ramda';
import { MazeGame } from '../game';
import { Direction, ICell, IPosition, ISize } from '../game.definitions';
import { PositionHelper } from './position.helper';

export class RandomHelper {
  static range(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static boolean(): boolean {
    /*
      fun boolean randomization strategy:
      - randomize number from a hundred to a million
      - add one to it to make it even, if necessary
      - randomize a number from 1 to the resulting number
      - if the secondly randomized number is grater than
        half of the resulting number, returns true.
    */
    let total = RandomHelper.range(100, 1000000);
    if (total % 2 > 0) total++; // make it even
    return RandomHelper.range(1, total) > (total / 2);
  }

  static arrayItem<T>(array: T[] = []): T {
    if (!array.length) return null;
    return array[RandomHelper.range(0, array.length - 1)];
  }

  static direction(): Direction {
    return R.pipe(R.values, RandomHelper.arrayItem)(Direction);
  }

  static wall(game: MazeGame): ICell {
    return RandomHelper.arrayItem(PositionHelper.getBordersFromMaze(game.grid.cells, game));
  }
}
