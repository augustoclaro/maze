export class RandomHelper {
  static range(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static arrayItem<T>(array: T[] = []): T {
    if (!array.length) return null;
    return array[RandomHelper.range(0, array.length - 1)];
  }
}
