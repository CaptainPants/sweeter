import { Signal } from ".";

import '../internal/polyfill.js';

export type AmbientSignalUsageListener<T> = (signal: Signal<T>) => void;

let listenerStack: AmbientSignalUsageListener<unknown>[] = [];

export function listen(listener: AmbientSignalUsageListener<unknown>): { [Symbol.dispose]: () => void } {
    throw 'Not implemented';
}