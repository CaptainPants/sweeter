import { SignalController } from './SignalController.js';
import { InitiatedSignalState, SignalState } from './SignalState.js';

/**
 * Provides a readonly Signal, that can be controlled by using the provided Controller instance. This allows for cases where a Signal is passed to a callback as read only,
 * but needs to be updated by the caller when some condition changes. It is similar to a ReadWriteSignal where the Write component is separated out.
 * @param controller
 * @returns
 */
export function $controller<T>(
    initialState?: SignalState<T>,
): SignalController<T> {
    return new SignalController<T>(initialState ?? SignalState.init());
}
