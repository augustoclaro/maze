import * as R from 'ramda';
import { MazeGame } from '../game';
import { Direction, ICell, ICellsMap, IPosition, ISize } from '../game.definitions';
import { MazeHelper } from '../helpers/maze.helper';

export class Grid {
  cells: ICellsMap;
  gridGraphics: Phaser.Graphics;
  gridSprite: Phaser.Sprite;

  constructor(
    gameSize: ISize,
    public cellSize: number,
    public wallHeight: number,
    public targetPosition: IPosition,
  ) {
    this.cells = MazeHelper.generateMazeCells(gameSize, cellSize);
  }

  drawToSprite(game: MazeGame) {
    if (!this.gridGraphics) return;
    if (!!this.gridSprite) {
      this.gridSprite.destroy();
    }
    this.gridSprite = game.add.sprite(
      -this.wallHeight,
      -this.wallHeight,
      this.gridGraphics.generateTexture(),
    );
  }

  createGrid(game: MazeGame) {
    this.gridGraphics = game.make.graphics(0, 0);
    // this.gridGraphics.clear();
    this.drawTarget();
    R.pipe(
      R.values,
      R.forEach(cell => this.drawCell(cell)),
    )(this.cells);
    this.drawToSprite(game);
  }

  destroy() {
    if (!!this.gridGraphics) this.gridGraphics.destroy();
    if (!!this.gridSprite) this.gridSprite.destroy();
  }

  private drawTarget() {
    if (!this.gridGraphics) return;
    this.gridGraphics
      .lineStyle(0)
      .beginFill(0x7C0A02, 1)
      .drawRect(
        this.targetPosition.x * this.cellSize,
        this.targetPosition.y * this.cellSize,
        this.cellSize,
        this.cellSize,
      )
      .endFill();
  }

  private drawCell({ x, y, walls }: ICell) {
    // up
    this.drawLine(
      { x, y },
      { x: x + 1, y },
      walls[Direction.UP],
    );
    // left
    this.drawLine(
      { x, y },
      { x, y: y + 1 },
      walls[Direction.LEFT],
    );
    // down
    this.drawLine(
      { x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      walls[Direction.DOWN],
    );
    // right
    this.drawLine(
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
      walls[Direction.RIGHT],
    );
  }

  private drawLine(
    from: IPosition,
    to: IPosition,
    wall: boolean = false,
  ) {
    if (!this.gridGraphics) return;
    this.gridGraphics
      .lineStyle(wall ? this.wallHeight : 0, 0xFF0000)
      .moveTo(from.x * this.cellSize, from.y * this.cellSize)
      .lineTo(to.x * this.cellSize, to.y * this.cellSize)
      .endFill();
  }
}
