import { Context } from './context/Context.js';
import { dev } from './dev.js';

export {};

// Make this easily accessible from the window object
declare global {
    // eslint-disable-next-line -- var is required for globals
    var sweeter: {
        dev: typeof dev;
        debugLogContexts: () => void;
    };
}
globalThis.sweeter = {
    dev,
    debugLogContexts: () => Context.debugLogCurrent(),
};
