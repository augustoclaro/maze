import { GAME } from './game.constants';
import { ISize } from './game.definitions';
import { MazeHelper } from './helpers/maze.helper';
import { Grid } from './models/grid';
import { Player } from './models/player';
import { MainState } from './states/main.state';

export class MazeGame extends Phaser.Game {
  w: number;
  h: number;
  player: Player;
  grid: Grid;
  isReseting: boolean;
  usePathFinder: boolean;

  constructor(
    size: ISize,
    usePathFinder: boolean = false,
    container = document.getElementById(GAME.CONTAINER_ID),
  ) {
    if (!container) throw new Error('Container can\'t be null.');
    // validate container size
    const cellSize = MazeHelper.getCellSize(size, container);
    const moveSpeed = cellSize / 10;
    const wallHeight = cellSize / 10;
    const windowPixels = MazeHelper.getWindowPixels(size, cellSize, wallHeight);
    if (cellSize < GAME.MIN_SQM_SIZE) {
      throw new Error(
        `Window too small. Min: ${windowPixels.minSize.width}x${windowPixels.minSize.height}`,
      );
    }
    // initialize game with correct sizes
    container.setAttribute('style', `padding-top: ${GAME.MARGIN}px;`);
    super(
      windowPixels.size.width,
      windowPixels.size.height,
      Phaser.CANVAS,
      container,
      new MainState(),
    );
    // initialize game object
    this.w = size.w;
    this.h = size.h;
    this.grid = new Grid(this, cellSize, wallHeight, { x: size.w - 1, y: size.h - 1 });
    this.player = new Player(
      moveSpeed,
      this.grid,
    );
    this.usePathFinder = usePathFinder;
  }

  reset() {
    this.isReseting = false;
    this.grid.destroy();
    this.player.destroy();
    this.grid = new Grid(
      this,
      this.grid.cellSize,
      this.grid.wallHeight,
      { x: this.w - 1, y: this.h - 1 },
    );
    this.player = new Player(
      this.player.moveSpeed,
      this.grid,
    );
  }
}
