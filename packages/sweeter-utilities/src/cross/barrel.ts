import { throwError } from '../throwError';

const brand = Symbol('BRAND');

export interface TimeoutHandle {
    [brand]: 'TIMEOUT_HANDLE';
}
export interface IntervalHandle {
    [brand]: 'INTERVAL_HANDLE';
}

interface GlobalThisType {
    setTimeout?: (callback: () => void, timeout: number) => TimeoutHandle;
    clearTimeout?: (handle: TimeoutHandle) => void;
    setInterval?: (callback: () => void, timeout: number) => IntervalHandle;
    clearInterval?: (handle: IntervalHandle) => void;
}

const globalThisTyped: undefined | GlobalThisType = globalThis as any;

const setTimeout =
    globalThisTyped?.setTimeout ??
    (() => throwError('No setTimeout implementation found'));
const clearTimeout =
    globalThisTyped?.clearTimeout ??
    (() => throwError('No clearTimeout implementation found'));
const setInterval =
    globalThisTyped?.setInterval ??
    (() => throwError('No setInterval implementation found'));
const clearInterval =
    globalThisTyped?.clearInterval ??
    (() => throwError('No clearInterval implementation found'));

export { setTimeout, clearTimeout, setInterval, clearInterval };
