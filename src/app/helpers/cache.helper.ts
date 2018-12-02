import * as R from 'ramda';

export class CacheHelper {
  static cache: Map<string, any> = new Map();

  static cacheAs<T>(key: string, cacheValueFn: () => T): T {
    if (this.cache.has(key)) return this.cache.get(key);
    const value = cacheValueFn();
    this.cache.set(key, value);
    return value;
  }

  static clear() {
    this.cache.clear();
  }
}
