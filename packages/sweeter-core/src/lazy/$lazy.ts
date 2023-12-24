export type LazyState = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR';

export interface Lazy<T> {
    /**
     * Make sure that the lazy load has been triggered.
     */
    ensure(): void;

    /**
     * Promise that resolves when the result of this lazy operation becomes available.
     */
    readonly promise: Promise<T>;

    /**
     * The current state of the Lazy operation.
     */
    readonly state: LazyState;

    /**
     * Whether or not it is valid to retrieve the result of the lazy operation (I.e. outcome == 'SUCCESS' || outcome == 'ERROR')
     */
    readonly resolved: boolean;

    /**
     * Get the result of the lazy load immediately, returning undefined if it is not yet available.
     */
    tryGetResult(): T | undefined;

    /**
     * Get the result of the lazy load immediately, throwing a TypeError if it is not yet available.
     */
    getResult(): T;

    /**
     * Get the exception thrown as the result of the lazy load immediately, returning undefined if it is not yet available. Throws a TypeError if the result was not an error.
     */
    tryGetError(): unknown | undefined;

    /**
     * Get the exception thrown as the result of the lazy load immediately, throwing a TypeError if it is not yet available. Throws a TypeError if the result was not an error.
     */
    getError(): unknown;
}

/**
 * A wrapper for a lazily evaluated asynchronous operation. Looks outwardly like a promise that has accessors for the caller to determine if the operation has completed and what the outcome was.
 * @param factory Callback to be invoked the first time that the outcome of the operation is needed.
 * @returns
 */
export function $lazy<T>(factory: () => Promise<T>) {
    return new LazyImplementation(factory);
}

class LazyImplementation<T> implements Lazy<T> {
    #factory: () => Promise<T>;

    #promise: Promise<T> | undefined = undefined;
    #outcome: LazyState = 'INITIAL';
    #result: T | undefined = undefined;
    #error: unknown = undefined;

    constructor(factory: () => Promise<T>) {
        this.#factory = factory;
    }

    get promise(): Promise<T> {
        return this.#getOrCreatePromise();
    }

    ensure(): void {
        this.#getOrCreatePromise();
    }

    #getOrCreatePromise(): Promise<T> {
        if (!this.#promise) {
            this.#outcome = 'LOADING';
            const promise = this.#factory();

            promise.then(
                (res) => {
                    this.#result = res;
                    this.#outcome = 'SUCCESS';
                },
                (err) => {
                    this.#error = err;
                    this.#outcome = 'ERROR';
                },
            );

            this.#promise = promise;
        }
        return this.#promise;
    }

    get state(): LazyState {
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
