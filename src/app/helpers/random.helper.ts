import { Noise } from 'noisejs';
const noise = new Noise(Math.random());

export class RandomHelper {
  static range(min: number, max: number) {
    return this._range(Math.random(), min, max);
  }

  static noiseRange(xoffset: number, yoffset: number, min: number, max: number) {
    return this._range(noise.simplex2(xoffset, yoffset), min, max);
  }

  static noiseArrayItem<T>(xoffset: number, yoffset: number, array: T[] = []): T {
    if (!array.length) return null;
    return array[RandomHelper.noiseRange(xoffset, yoffset, 0, array.length - 1)];
  }

  static arrayItem<T>(array: T[] = []): T {
    if (!array.length) return null;
    return array[RandomHelper.range(0, array.length - 1)];
  }

  private static _range(rand: number, min: number, max: number) {
    return Math.floor(rand * (max - min + 1)) + min;
  }
}
