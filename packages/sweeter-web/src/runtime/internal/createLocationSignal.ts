import {
    $controlled,
    type Signal,
    SignalController,
} from '@captainpants/sweeter-core';

export interface LocationSignalResult {
    /**
     * Removes event handlers from window.
     */
    dispose: () => void;
    /**
     * Signal representing the current url.
     */
    signal: Signal<string>;
    /**
     * Manually trigger an update to the location (noting that an unchanged location won't updated dependents).
     *
     * This is called by navigate in WebRuntime.
     */
    ping: () => void;
}

export function createLocationSignal(): LocationSignalResult {
    const signalController = new SignalController<string>();
    const signal = $controlled(signalController);

    function updateState() {
        signalController.update({
            mode: 'SUCCESS',
            value: location.toString(),
        });
    }

    updateState();

    window.addEventListener('pushstate', updateState);
    window.addEventListener('popstate', updateState);

    function dispose() {
        window.removeEventListener('pushstate', updateState);
        window.removeEventListener('popstate', updateState);
    }

    return {
        dispose,
        signal,
        ping: updateState,
    };
}
