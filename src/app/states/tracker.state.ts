import * as R from 'ramda';
import { GAME } from '../game.constants';
import { Direction, ITrackedCell } from '../game.definitions';
import { PositionHelper } from '../helpers/position.helper';
import { RandomHelper } from '../helpers/random.helper';
import { MainState } from './main.state';

//  this state is a visualization of the maze generation algorithm
export class TrackerState extends MainState {
  current: ITrackedCell;
  trackerSprite: Phaser.Sprite;
  trackStack: ITrackedCell[];

  create() {
    super.create();
    this.trackerSprite = this.drawRect('green');
    this.trackStack = [];
  }

  update() {
    this.trackNext();
  }

  private trackNext() {
    if (!this.current) {
      this.visit(this.game.grid.cells[PositionHelper.getUniqueId({ x: 0, y: 0 })]);
      // this.visit(RandomHelper.wall(this.game));
      return;
    }
    const neighbors = PositionHelper.getNeighbors<ITrackedCell>(this.game.grid.cells, this.current);
    const nextDir = RandomHelper.arrayItem(
      R.filter(dir => !neighbors[dir].visited, R.keys(neighbors))
    ) as Direction;
    const nextCell = neighbors[nextDir];
    if (!!nextCell) {
      this.visit(nextCell, nextDir);
    } else if (!!this.trackStack.length) {
      this.visit(this.trackStack.pop(), null, true);
    }
    this.game.grid.createGrid(this.game);
  }

  private visit(cell: ITrackedCell, dir: Direction = null, skipStack: boolean = false) {
    if (!!this.current) {
      if (!!dir) this.current.walls = R.assoc(`${dir}`, false, this.current.walls);
      if (!skipStack) this.trackStack.push(this.current);
    }
    cell.visited = true;
    this.current = cell;
    this.trackerSprite.position.set(
      cell.x * this.game.grid.cellSize,
      cell.y * this.game.grid.cellSize,
    );
    if (!dir) return;
    const wallDirectionToRemove = GAME.WALL_FACING_DIRECTION[dir];
    cell.walls = R.assoc(`${wallDirectionToRemove}`, false, cell.walls);
  }

  private drawRect(color: string): Phaser.Sprite {
    const bmp = this.game.add.bitmapData(this.game.grid.cellSize, this.game.grid.cellSize);
    bmp.ctx.beginPath();
    bmp.ctx.rect(0, 0, this.game.grid.cellSize, this.game.grid.cellSize);
    bmp.ctx.fillStyle = color;
    bmp.ctx.fill();
    return this.game.add.sprite(0, 0, bmp);
  }
}
