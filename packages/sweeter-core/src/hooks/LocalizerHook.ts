import { type ComponentInit } from '../types.js';

export function LocalizerHook(init: ComponentInit) {
    return {
        localize(key: string | null | undefined) {
            return key ?? '';
        },
    };
}
