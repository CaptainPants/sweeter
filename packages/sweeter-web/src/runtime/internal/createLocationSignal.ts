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

    const signal = $controlled(signalController, {
        mode: 'SUCCESS',
        value: createLocationSignal.getLocation(),
    });

    function updateState() {
        signalController.update({
            mode: 'SUCCESS',
            value: createLocationSignal.getLocation(),
        });
    }


    window.addEventListener('pushstate', updateState);
    window.addEventListener('popstate', updateState);

    function dispose() {
        window.removeEventListener('popstate', updateState);
        window.removeEventListener('pushstate', updateState);
    }

    return {
        dispose,
        signal,
        ping: updateState,
    };
}
/**
 * Basically exists to allow easy overriding for testing as JSDOM doesn't support
 * the history API properly
 * @returns 
 */
createLocationSignal.getLocation = function() {
    return window.location.toString();
}