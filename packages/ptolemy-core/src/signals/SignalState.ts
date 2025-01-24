interface InitialSignalState {
    mode: 'INITIALISING';
}
interface SuccessSignalState<T> {
    mode: 'SUCCESS';
    value: T;
}
interface ErrorSignalState {
    mode: 'ERROR';
    error: unknown;
}

export type SignalState<T> =
    | InitialSignalState
    | SuccessSignalState<T>
    | ErrorSignalState;

export type InitiatedSignalState<T> = Exclude<
    SignalState<T>,
    InitialSignalState
>;

const initValue: InitialSignalState = Object.freeze({ mode: 'INITIALISING' });

// eslint-disable-next-line @typescript-eslint/no-namespace -- We are using a namespace here to add 'static functions' to an interface
export namespace SignalState {
    export function init(): InitialSignalState {
        return initValue;
    }
    export function success<T>(value: T): SuccessSignalState<T> {
        return Object.freeze({ mode: 'SUCCESS', value: value });
    }
    export function error(error: unknown): ErrorSignalState {
        return Object.freeze({ mode: 'ERROR', error: error });
    }

    export function isEqual<T>(a: SignalState<T>, b: SignalState<T>): boolean {
        if (a.mode === 'INITIALISING') {
            return b.mode === 'INITIALISING';
        } else if (a.mode === 'SUCCESS') {
            return b.mode === 'SUCCESS' && Object.is(a.value, b.value);
        } else {
            return b.mode === 'ERROR' && Object.is(a.error, b.error);
        }
    }

    /**
     * Extract value or rethrow error from state.
     * @param state
     * @returns
     */
    export function getValue<T>(state: SignalState<T>): T {
        if (state.mode === 'INITIALISING') {
            throw new Error('This signal has not finished initialising');
        } else if (state.mode === 'SUCCESS') {
            return state.value;
        } else {
            throw state.error;
        }
    }
}
