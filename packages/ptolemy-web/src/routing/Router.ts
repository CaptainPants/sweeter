import { $derived, Component } from '@serpentis/ptolemy-core';

import { getPath } from './implementation/getPath.js';
import { pathDoesNotMatch } from './pathDoesNotMatch.js';
import { type Route } from './types.js';

export interface RouterProps {
    basePath?: string;
    url: string;

    routes: readonly Route<readonly string[]>[];

    fallback?: (() => JSX.Element) | undefined;
}

export const Router: Component<RouterProps> = (
    { basePath, url, routes, fallback },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init,
) => {
    const asUrl = $derived(() => new URL(url.value));

    return $derived(() => {
        // Allow for '/' as a base path
        let basePathResolved = basePath?.value ?? '';
        if (basePathResolved.startsWith('/')) {
            basePathResolved = basePathResolved.substring(1);
        }

        const path = getPath(asUrl.value, basePathResolved);

        if (path !== null) {
            for (const route of routes.value) {
                // basePath should be removed from path
                const match = route.match(path, asUrl.value);

                if (match !== pathDoesNotMatch) {
                    return match;
                }
            }
        }

        return fallback?.value?.();
    });
};
