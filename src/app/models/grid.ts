import * as R from 'ramda';
import { MazeGame } from '../game';
import { Directions } from '../game.constants';
import { CellFlags, Direction, ICell, ICellsMap, IPosition, ISize } from '../game.definitions';
import { MazeHelper } from '../helpers/maze.helper';
import { PositionHelper } from '../helpers/position.helper';

export class Grid {
  cells: ICellsMap;
  gridGraphics: Phaser.Graphics;
  gridSprite: Phaser.Sprite;

  constructor(
    private gameSize: ISize,
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

  // getPixels() {
  //   const bmd = this.game.make.bitmapData(this.game.width, this.game.height);
  //   bmd.draw(this.gridSprite);
  //   return bmd.getPixels(
  //     new Phaser.Rectangle(0, 0, this.game.width, this.game.height),
  //   ).data;
  // }

  getWallsDefinitions(): number[] {
    let wallsDef = [];
    for (let x = 0; x < this.gameSize.w; x++) {
      for (let y = 0; y < this.gameSize.h; y++) {
        const cellId = PositionHelper.getUniqueId({ x, y });
        const cell = this.cells[cellId];
        wallsDef = R.concat(
          wallsDef,
          R.map(dir => Number(cell.walls[dir]), Directions),
        );
      }
    }
    // console.log(wallsDef);
    return wallsDef;
  }

  getWallsBitwiseDefinitions(): number[] {
    // tslint:disable:no-bitwise
    const allWallsNumber = Direction.UP | Direction.LEFT | Direction.DOWN | Direction.RIGHT;
    const wallsDef = [];
    for (let x = 0; x < this.gameSize.w; x++) {
      for (let y = 0; y < this.gameSize.h; y++) {
        const cellId = PositionHelper.getUniqueId({ x, y });
        const cell = this.cells[cellId];
        const cellWalls = R.reduce(
          (acc, dir) => cell.walls[dir] ? (acc | dir) : acc,
          0,
          Directions,
        );
        // console.log(cellWalls / allWallsNumber);
        wallsDef.push(cellWalls / allWallsNumber);
      }
    }
    // console.log(wallsDef);
    return wallsDef;
    // tslint:enable:no-bitwise
  }

  getCellsFlags(playerPos: IPosition): CellFlags[] {
    // tslint:disable:no-bitwise
    const cellsFlags: CellFlags[] = [];
    for (let x = 0; x < this.gameSize.w; x++) {
      for (let y = 0; y < this.gameSize.h; y++) {
        const cellId = PositionHelper.getUniqueId({ x, y });
        const cell = this.cells[cellId];
        let flags = CellFlags.NONE;
        if (cell.walls[Direction.LEFT]) {
          flags |= CellFlags.LEFT_WALL;
        }
        if (cell.walls[Direction.UP]) {
          flags |= CellFlags.UP_WALL;
        }
        if (cell.walls[Direction.RIGHT]) {
          flags |= CellFlags.RIGHT_WALL;
        }
        if (cell.walls[Direction.DOWN]) {
          flags |= CellFlags.DOWN_WALL;
        }
        if (PositionHelper.equals(cell, playerPos)) {
          flags |= CellFlags.HAS_PLAYER;
        }
        if (PositionHelper.equals(cell, this.targetPosition)) {
          flags |= CellFlags.IS_TARGET;
        }
        cellsFlags.push(flags / CellFlags.ALL_FLAGS);
      }
    }

    return cellsFlags;
    // tslint:enable:no-bitwise
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
