export type LazyOutcome = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR';

export interface Lazy<T> {
    ensure(): void;
    promise: Promise<T>;
    outcome: LazyOutcome;
    resolved: boolean;
    tryGetResult(): T | undefined;
    getResult(): T;
    tryGetError(): unknown | undefined;
    getError(): unknown;
}

export function $lazy<T>(callback: () => Promise<T>) {
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
        return this.#getOrCreatePromise();
    }

    ensure(): void {
        this.#getOrCreatePromise();
    }
    
    #getOrCreatePromise(): Promise<T>
    {
        if (!this.#promise) {
            this.#outcome = 'LOADING';
            const promise = this.#callback();
            
            promise.then(
                (res) => {
                    this.#result = res;
                    this.#outcome = 'SUCCESS';
                },
                (err) => {
                    this.#error = err;
                    this.#outcome = 'ERROR';
                }
            );

            this.#promise = promise;
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

    tryGetError(): unknown | undefined {
        if (this.#outcome === 'ERROR') {
            return this.#error!;
        } else if (this.#outcome === 'SUCCESS') {
            throw new TypeError('Promise resolved successfully.');
        }

        return undefined;
    }

    getError(): unknown {
        if (this.#outcome === 'ERROR') {
            return this.#error!;
        } else if (this.#outcome === 'SUCCESS') {
            throw new TypeError('Promise resolved successfully.');
        }

        throw new TypeError(
            'Promise has not yet resolved, you should check this value of .resolved or .outcome before calling getError().',
        );
    }
}
