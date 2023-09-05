import { Signal } from '../Signal.js';
import { listenForSignalUsage } from '../ambient.js';

export function track(callback: () => void) {
    const listener = (signal: Signal<unknown>) => {
        console.log('thing');
    };

    {
        using _ = listenForSignalUsage(listener);

        callback();
    }
}
