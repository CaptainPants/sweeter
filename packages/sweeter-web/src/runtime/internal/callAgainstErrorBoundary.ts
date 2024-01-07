import {
    type ContextSnapshot,
    ErrorBoundaryContext,
    isCalculationRunning,
} from '@captainpants/sweeter-core';

export function callAgainstErrorBoundary<T>(
    contextSnapshot: ContextSnapshot,
    callback: () => T,
    ifError: T,
): T | undefined {
    try {
        return callback();
    } catch (ex) {
        if (isCalculationRunning()) {
            throw ex;
        } else {
            contextSnapshot(ErrorBoundaryContext).error(ex);
            return ifError;
        }
    }
}
