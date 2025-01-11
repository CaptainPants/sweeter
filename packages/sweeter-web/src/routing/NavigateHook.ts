import { type ComponentInit } from '@captainpants/sweeter-core';

import { getWebRuntime } from '../runtime/getWebRuntime.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NavigateHook = (init: ComponentInit) => {
    const runtime = getWebRuntime();
    return {
        navigate: (url: string) => {
            runtime.navigate(url);
        },
    };
};
