import { Context } from './context';
import { dev } from './dev';

export {};

// Make this easily accessible from the window object
declare global {
    var sweeter: {
        dev: typeof dev;
        debugLogContexts: () => void;
    };
}
globalThis.sweeter = {
    dev,
    debugLogContexts: () => Context.debugLogCurrent(),
};
