export class WorkerHelper {
  static fromFunction(workerFn: (self: Worker) => any): Worker {
    const workerJsBody = `(${workerFn})(self)`;
    const workerBlob = new Blob([workerJsBody], { type: 'text/javascript' });
    const url = URL.createObjectURL(workerBlob);
    return new Worker(url);
  }
}
