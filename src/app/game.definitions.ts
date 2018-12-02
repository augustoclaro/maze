export enum Direction {
  LEFT = 1,
  UP = 2,
  RIGHT = 4,
  DOWN = 8,
}

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
