import { $controlled, SignalController } from '@captainpants/sweeter-core';

export function createLocationSignal() {
    const signalController = new SignalController<URL>();
    const signal = $controlled(signalController);

    function updateState() {
        signalController.update({
            mode: 'SUCCESS',
            value: new URL(location.toString()),
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
    };
}
