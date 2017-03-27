import { ICancellationToken } from './ICancellationToken';

export namespace CancellationToken {


    export function await<T>(promise: Promise<T>, cancellationToken: ICancellationToken): Promise<T> {
        return cancellationToken == null
            ? promise
            : new Promise((resolve, reject) => {
            cancellationToken.onCancellationRequested(() => resolve());
            promise.then(resolve).catch(reject);
        });
    }
}