import * as R from 'ramda';
import { GAME } from '../game.constants';
import {
  Direction,
  ICanvasSize,
  ICell,
  ICellsMap,
  IPosition,
  ISize,
  IWindowPixels,
} from '../game.definitions';
import { PositionHelper } from './position.helper';
import { RandomHelper } from './random.helper';

export class MazeHelper {
  static getCellSize(mazeSize: ISize, container: HTMLElement): number {
    const marginSize = 2 * GAME.MARGIN;
    const windowSize = {
      w: container.offsetWidth - marginSize,
      h: container.offsetHeight - marginSize,
    };
    const availableSize = {
      w: windowSize.w / mazeSize.w,
      h: windowSize.h / mazeSize.h,
    };
    return Math.min(availableSize.w, availableSize.h, GAME.MAX_SQM_SIZE);
  }

  static getWindowPixels(mazeSize: ISize, cellSize: number, wallHeight: number): IWindowPixels {
    const marginSize = 2 * GAME.MARGIN;
    const size: ICanvasSize = {
      width: mazeSize.w * cellSize,
      height: mazeSize.h * cellSize,
    };
    return {
      size,
      minSize: {
        width: GAME.MIN_SQM_SIZE * mazeSize.w + marginSize + wallHeight,
        height: GAME.MIN_SQM_SIZE * mazeSize.h + marginSize + wallHeight,
      },
    };
  }

  static generateMazeCells(gameSize: ISize, cellSize: number): ICellsMap {
    const cells: ICellsMap = MazeHelper.generateInitialCells(gameSize, cellSize);
    const stack = [];
    const visited: ICellsMap<boolean> = {};
    let current;
    const visit = (cell: ICell, dir: Direction = null, skipStack: boolean = false) => {
      if (!!current) {
        if (!!dir) current.walls = R.assoc(`${dir}`, false, current.walls);
        if (!skipStack) stack.push(current);
      }
      visited[cell.id] = true;
      current = cell;
      const wallDirectionToRemove = GAME.WALL_FACING_DIRECTION[dir];
      if (!!wallDirectionToRemove) {
        cell.walls = R.assoc(`${wallDirectionToRemove}`, false, cell.walls);
      }
    };
    visit(cells[PositionHelper.getUniqueId({ x: 0, y: 0 })]);
    while (true) {
      const neighbors = PositionHelper.getNeighbors(cells, current);
      const nextDir = RandomHelper.arrayItem(
        R.filter(dir => !visited[neighbors[dir].id], R.keys(neighbors))
      ) as Direction;
      const nextCell = neighbors[nextDir];
      if (!!nextCell) {
        visit(nextCell, nextDir);
      } else if (!!stack.length) {
        visit(stack.pop(), null, true);
      } else {
        break;
      }
    }
    return cells;
  }

  static findPath(cells: ICellsMap, from: IPosition, to: IPosition): IPosition[] {
    let path: IPosition[] = [];
    const stack = [];
    const visited: ICellsMap<boolean> = {};
    let current: ICell;
    const visit = (cell: ICell, skipStack: boolean = false) => {
      if (!!current) {
        if (!skipStack) stack.push(current);
        const visitedCellIndex = R.findLastIndex(pos => PositionHelper.equals(pos, current), path);
        if (visitedCellIndex > -1) path = R.slice(0, visitedCellIndex, path);
        path = R.concat(path, [current]);
      }
      visited[cell.id] = true;
      current = cell;
    };
    visit(cells[PositionHelper.getUniqueId(from)]);
    while (true) {
      const neighbors = PositionHelper.getNeighbors(cells, current);
      const possibleNighbors = R.pipe(
        R.keys,
        R.map(dir => {
          if (
            visited[neighbors[dir].id] ||
            current.walls[dir] ||
            neighbors[dir].walls[GAME.WALL_FACING_DIRECTION[dir]]
          ) return null;
          return neighbors[dir];
        }),
        list => R.filter<ICell>(Boolean, list),
      )(neighbors);
      const nextCell = MazeHelper.closestTo(to, possibleNighbors);
      // const nextDir = RandomHelper.arrayItem(
      //   R.filter(dir =>
      //     !visited[neighbors[dir].id] &&
      //     !current.walls[dir] &&
      //     !neighbors[dir].walls[GAME.WALL_FACING_DIRECTION[dir]]
      //   , R.keys(neighbors))
      // ) as Direction;
      // const nextCell = neighbors[nextDir];
      if (!!nextCell) {
        visit(nextCell);
        if (PositionHelper.equals(nextCell, to)) return R.concat(path, [nextCell]);
      } else if (!!stack.length) {
        visit(stack.pop(), true);
      } else {
        break;
      }
    }
  }

  private static closestTo<T extends IPosition>(pos: IPosition, list: T[] = []): T {
    const distances = R.map(from => MazeHelper.distanceBetween(from, pos), list);
    const closestIndex = R.indexOf(Math.min(...distances), distances);
    return list[closestIndex];
  }

  private static distanceBetween(from: IPosition, to: IPosition): number {
    return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  }

  // static

  private static generateInitialCells(size: ISize, cellSize: number): ICellsMap {
    const map: ICellsMap = {};
    for (let x = 0; x < size.w; x++) {
      for (let y = 0; y < size.h; y++) {
        const cell = this.generateCell({ x, y }, { w: cellSize, h: cellSize });
        map[cell.id] = cell;
      }
    }
    return map;
  }

  private static generateCell(pos: IPosition, cellSize: ISize): ICell {
    return {
      id: PositionHelper.getUniqueId(pos),
      walls: {
        [Direction.RIGHT]: true,
        [Direction.LEFT]: true,
        [Direction.UP]: true,
        [Direction.DOWN]: true,
      },
      ...cellSize,
      ...pos,
    };
  }
}
