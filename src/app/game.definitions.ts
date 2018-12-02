export enum Direction {
  LEFT = 1,
  UP = 2,
  RIGHT = 4,
  DOWN = 8,
}

export enum CellFlags {
  NONE = 0,
  LEFT_WALL = 1,
  UP_WALL = 2,
  RIGHT_WALL = 4,
  DOWN_WALL = 8,
  HAS_PLAYER = 16,
  IS_TARGET = 32,
  // tslint:disable:no-bitwise
  ALL_FLAGS =
    CellFlags.LEFT_WALL |
    CellFlags.UP_WALL |
    CellFlags.RIGHT_WALL |
    CellFlags.DOWN_WALL |
    CellFlags.HAS_PLAYER |
    CellFlags.IS_TARGET,
  // tslint:enable:no-bitwise
}

console.log(CellFlags.ALL_FLAGS);

export interface IDirectionMap<T> {
  [dir: number]: T;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ICanvasPosition {
  canvasX: number;
  canvasY: number;
}

export interface ISize {
  w: number;
  h: number;
}

export interface ICanvasSize {
  width: number;
  height: number;
}

export interface IBox extends IPosition, ISize {}

export interface ICell extends IBox {
  id: string;
  walls: IDirectionMap<boolean>;
}

export interface ICellsMap<TCell = ICell> { [cellId: string]: TCell; }

export interface IWindowPixels {
  size: ICanvasSize;
  minSize: ICanvasSize;
}

export interface ITrackedCell extends ICell {
  visited?: boolean;
}
