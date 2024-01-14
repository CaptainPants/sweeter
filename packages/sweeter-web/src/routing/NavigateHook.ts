import { type ComponentInit } from '@captainpants/sweeter-core';

export function NavigateHook(init: ComponentInit) {
    return {
        navigate(url: string) {
            window.history.pushState(undefined, '', url);
        },
    };
}
