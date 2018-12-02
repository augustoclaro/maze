import { Direction, IDirectionMap, IPosition, ISize } from './game.definitions';

// the order of this array is the order of walls input to Neural Network
export const Directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN];

const DIRECTION_LABELS_MAP: IDirectionMap<string> = {
  [Direction.LEFT]: 'LEFT',
  [Direction.UP]: 'UP',
  [Direction.RIGHT]: 'RIGHT',
  [Direction.DOWN]: 'DOWN',
};

const DIRECTION_OFFSET_MAP: IDirectionMap<IPosition> = {
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.RIGHT]: { x: 1, y: 0 },
  [Direction.DOWN]: { x: 0, y: 1 },
};

export const GAME = {
  CONTAINER_ID: 'game-container',
  MIN_SQM_SIZE: 10,
  MAX_SQM_SIZE: 100,
  MARGIN: 15,
  DIRECTION_OFFSET_MAP,
  DIRECTION_LABELS_MAP,
  WALL_FACING_DIRECTION: {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
  } as IDirectionMap<Direction>,
  DEFAULT_SIZE: {
    w: 3,
    h: 3,
  } as ISize,
};
