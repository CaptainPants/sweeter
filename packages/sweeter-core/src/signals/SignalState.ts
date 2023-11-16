export type SignalState<T> =
    | { readonly mode: 'SUCCESS'; readonly value: T }
    | { readonly mode: 'ERROR'; readonly error: unknown };

export function isEqualSignalState<T>(
    a: SignalState<T>,
    b: SignalState<T>,
): boolean {
    if (a.mode === 'SUCCESS') {
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
export function getSignalValueFromState<T>(state: SignalState<T>): T {
    if (state.mode === 'SUCCESS') {
        return state.value;
    } else {
        throw state.error;
    }
}
