import { Direction, IDirectionMap, IPosition, ISize } from './game.definitions';

export const Directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN];

const DIRECTION_OFFSET_MAP: IDirectionMap<IPosition> = {
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.RIGHT]: { x: 1, y: 0 },
  [Direction.DOWN]: { x: 0, y: 1 },
};

export const GAME = {
  // custom setup
  MARGIN: 15,
  DEFAULT_SIZE: {
    w: 20,
    h: 20,
  } as ISize,
  // ----- game config
  CONTAINER_ID: 'game-container',
  MIN_SQM_SIZE: 10,
  MAX_SQM_SIZE: 100,
  DIRECTION_OFFSET_MAP,
  WALL_FACING_DIRECTION: {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
  } as IDirectionMap<Direction>,
};
