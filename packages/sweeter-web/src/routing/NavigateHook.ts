import { type ComponentInit } from '@captainpants/sweeter-core';
import { getWebRuntime } from '../runtime';

export function NavigateHook(init: ComponentInit) {
    const runtime = getWebRuntime();
    return {
        navigate(url: string) {
            runtime.navigate(url);
        },
    };
}
