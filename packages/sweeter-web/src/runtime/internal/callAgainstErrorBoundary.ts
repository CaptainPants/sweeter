import {
    type ContextSnapshot,
    ErrorBoundaryContext,
} from '@captainpants/sweeter-core';

export function callAgainstErrorBoundary<T>(
    contextSnapshot: ContextSnapshot,
    callback: () => T,
    ifError: T,
): T | undefined {
    try {
        return callback();
    } catch (ex) {
        contextSnapshot(ErrorBoundaryContext).error(ex);
        return ifError;
    }
}
