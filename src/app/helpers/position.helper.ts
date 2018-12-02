import * as R from 'ramda';
import { Directions, GAME } from '../game.constants';
import {
  Direction,
  ICanvasPosition,
  ICanvasSize,
  ICell,
  ICellsMap,
  IDirectionMap,
  IPosition,
} from '../game.definitions';
import { Grid } from '../models/grid';
import { Player } from '../models/player';

export class PositionHelper {
  static equals<T extends any>(pos1: T, pos2: T): boolean {
    const x1 = pos1.x || pos1.canvasX;
    const x2 = pos2.x || pos2.canvasX;
    const y1 = pos1.y || pos1.canvasY;
    const y2 = pos2.y || pos2.canvasY;
    return x1 === x2 && y1 === y2;
  }

  static getUniqueId(pos: IPosition, prefix: string = 'id') {
    return `${prefix}-${Math.floor(pos.x)}-${Math.floor(pos.y)}`;
  }

  static getNeighbors<TCell = ICell>(
    cells: ICellsMap<TCell>,
    { x, y }: IPosition,
  ): IDirectionMap<TCell> {
    const result: IDirectionMap<TCell> = {};

    const upCell = cells[PositionHelper.getUniqueId({ x, y: y - 1 })];
    const leftCell = cells[PositionHelper.getUniqueId({ x: x - 1, y })];
    const downCell = cells[PositionHelper.getUniqueId({ x, y: y + 1 })];
    const rightCell = cells[PositionHelper.getUniqueId({ x: x + 1, y })];

    if (upCell) result[Direction.UP] = upCell;
    if (leftCell) result[Direction.LEFT] = leftCell;
    if (downCell) result[Direction.DOWN] = downCell;
    if (rightCell) result[Direction.RIGHT] = rightCell;

    return result;
  }

  static movePosition(grid: Grid, player: Player, dir: Direction): ICanvasPosition {
    const newPos = PositionHelper.getGamePosition(grid.cellSize, player.pos);
    const offset = GAME.DIRECTION_OFFSET_MAP[dir];
    newPos.x += offset.x;
    newPos.y += offset.y;
    return PositionHelper.getCanvasPosition(grid, player.playerSize, newPos);
  }

  static getGamePosition(cellSize: number, canvasPosition: ICanvasPosition): IPosition {
    return {
      x: Math.floor(canvasPosition.canvasX / cellSize),
      y: Math.floor(canvasPosition.canvasY / cellSize),
    };
  }

  static getCanvasPosition(
    grid: Grid,
    playerSize: number,
    pos: IPosition,
  ): ICanvasPosition {
    const halfWall = grid.wallHeight / 2;
    const marginOnCell = (grid.cellSize - grid.wallHeight - playerSize) / 2;
    return {
      canvasX: halfWall + marginOnCell + (pos.x * grid.cellSize),
      canvasY: halfWall + marginOnCell + (pos.y * grid.cellSize),
    };
  }

  static directionFromTouchCanvasPosition(
    gameSize: ICanvasSize,
    touchPos: ICanvasPosition,
  ): Direction {
    if (touchPos.canvasY <= gameSize.height * .375) return Direction.UP;
    if (touchPos.canvasY >= gameSize.height * .625) return Direction.DOWN;
    if (touchPos.canvasX <= gameSize.width * .375) return Direction.LEFT;
    if (touchPos.canvasX >= gameSize.width * .625) return Direction.RIGHT;
    return null;
  }

  // use this method to validate walls when making the player
  // walk pixels instead of entire squares
  static hasWall(
    grid: Grid,
    playerSize: number,
    canvasSize: ICanvasSize,
    canvasPosition: ICanvasPosition,
  ): boolean {
    const halfWall = grid.wallHeight / 2;
    if (canvasPosition.canvasX <= halfWall) return true;
    if (canvasPosition.canvasY <= halfWall / 2) return true;
    if (canvasPosition.canvasX >= canvasSize.width - halfWall - playerSize) return true;
    if (canvasPosition.canvasY >= canvasSize.height - halfWall - playerSize) return true;
    return PositionHelper.hasCellWall(
      grid,
      playerSize,
      canvasPosition,
    );
  }

  private static hasCellWall(
    grid: Grid,
    playerSize: number,
    canvasPosition: ICanvasPosition,
  ): boolean {
    const gamePos = PositionHelper.getGamePosition(grid.cellSize, canvasPosition);
    // console.log(gamePos);
    const cell = grid.cells[PositionHelper.getUniqueId(gamePos)];
    return !cell || R.any(
      dir => PositionHelper.isOverCellWall(
        grid,
        playerSize,
        cell,
        dir,
        canvasPosition,
      ),
      Directions,
    );
  }

  private static isOverCellWall(
    grid: Grid,
    playerSize: number,
    cell: ICell,
    dir: Direction,
    canvasPosition: ICanvasPosition,
  ): boolean {
    if (!cell.walls[dir]) return false;
    const halfWall = grid.wallHeight / 2;
    const xRotatingCellSize = canvasPosition.canvasX % grid.cellSize;
    const yRotatingCellSize = canvasPosition.canvasY % grid.cellSize;
    const lowerLimit = halfWall;
    const higherLimit = grid.cellSize - halfWall - playerSize;
    if (dir === Direction.UP && yRotatingCellSize <= lowerLimit) return true;
    if (dir === Direction.DOWN && yRotatingCellSize >= higherLimit) return true;
    if (dir === Direction.LEFT && xRotatingCellSize <= lowerLimit) return true;
    if (dir === Direction.RIGHT && xRotatingCellSize >= higherLimit) return true;
    return false;
  }
}
