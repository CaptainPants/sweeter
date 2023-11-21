import { getRuntime } from '@captainpants/sweeter-core';
import { webRuntimeSymbol } from './internal/webRuntimeSymbol.js';
import { type WebRuntime } from './types.js';

export function getWebRuntime(): WebRuntime {
    const runtime = getRuntime();
    if (runtime.type !== webRuntimeSymbol) {
        throw new TypeError('No WebRuntime set.');
    }
    return runtime as WebRuntime;
}
