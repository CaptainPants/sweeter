export type LazyOutcome = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR';

export interface Lazy<T> {
    promise: Promise<T>;
    outcome: LazyOutcome;
    resolved: boolean;
    tryGetResult(): T | undefined;
    getResult(): T;
}

export function lazy<T>(callback: () => Promise<T>) {
    return new LazyImplementation(callback);
}

class LazyImplementation<T> implements Lazy<T> {
    #callback: () => Promise<T>;

    #promise: Promise<T> | undefined = undefined;
    #outcome: LazyOutcome = 'INITIAL';
    #result: T | undefined = undefined;
    #error: unknown = undefined;

    constructor(callback: () => Promise<T>) {
        this.#callback = callback;
    }

    get promise(): Promise<T> {
        if (!this.#promise) {
            this.#outcome = 'LOADING';
            this.#promise = this.#callback();
            this.#promise.then((res) => {
                this.#result = res;
                this.#outcome = 'SUCCESS';
            });
            this.#promise.catch((err) => {
                this.#error = err;
                this.#outcome = 'ERROR';
            });
        }
        return this.#promise;
    }

    get outcome(): LazyOutcome {
        return this.#outcome;
    }

    get resolved(): boolean {
        return this.#outcome === 'ERROR' || this.#outcome === 'SUCCESS';
    }

    tryGetResult(): T | undefined {
        if (this.#outcome === 'SUCCESS') {
            return this.#result!;
        } else if (this.#outcome === 'ERROR') {
            throw this.#error;
        }

        return undefined;
    }

    getResult(): T {
        if (this.#outcome === 'SUCCESS') {
            return this.#result!;
        } else if (this.#outcome === 'ERROR') {
            throw this.#error;
        }

        throw new TypeError(
            'Promise has not yet resolved, you should check this value of .resolved or .outcome before calling getResult().',
        );
    }
}
