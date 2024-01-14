import {
    $controlled,
    type Signal,
    SignalController,
} from '@captainpants/sweeter-core';

export interface LocationSignalResult {
    dispose: () => void;
    signal: Signal<string>;
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
