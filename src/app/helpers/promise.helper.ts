import * as Promise from 'bluebird';
import * as R from 'ramda';

export class PromiseHelper {
  static runInSequence(actions: Array<() => Promise<any>>): Promise<any> {
    let resultArray = [];
    return R.reduce(
      (chain, action) =>
        chain.then(result => {
          resultArray = R.concat(resultArray, [result]);
          return action();
        }),
      Promise.resolve(),
      actions,
      // remove first item from array which is initial empty resolve result
    ).then(() => R.remove(0, 1, resultArray));
  }
}
