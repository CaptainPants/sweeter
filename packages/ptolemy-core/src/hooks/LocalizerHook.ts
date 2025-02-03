import { interpolatePlaceholders } from '@serpentis/ptolemy-utilities';

import { type ComponentInit } from '../types/index.js';

export type LocalizationTemplateCallback = (key: string) => string;

export interface Localizer {
    localize: {
        (key: string, args?: unknown[]): string;
        <TNully extends null | undefined>(
            key?: string | TNully,
            args?: unknown[],
        ): string | TNully;
    };
}

function localizeImplementation(
    key: string,
    args: undefined | unknown[],
): string;
function localizeImplementation<TNullOrUndefined extends undefined | null>(
    key: string | TNullOrUndefined,
    args: undefined | unknown[],
): string | TNullOrUndefined;

function localizeImplementation(
    key: string | null | undefined,
    args: undefined | unknown[],
): string | null | undefined {
    if (key === null || key === undefined) return key;
    const template = key;

    return interpolatePlaceholders(template, args);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LocalizerHook(init: ComponentInit): Localizer {
    return {
        localize: localizeImplementation,
    };
}
