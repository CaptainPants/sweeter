import {
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { $derived, $val } from '@captainpants/sweeter-core';

import { getPath } from './implementation/getPath.js';
import { pathDoesNotMatch } from './pathDoesNotMatch.js';
import { type Route } from './types.js';

export interface RouterProps {
    basePath?: string;
    url: string;

    routes: readonly Route<readonly string[]>[];

    fallback?: (() => JSX.Element) | undefined;
}

export function Router(
    { basePath, url, routes, fallback }: PropertiesMightBeSignals<RouterProps>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init: ComponentInit,
): JSX.Element {
    const asUrl = $derived(() => new URL($val(url)));

    return $derived(() => {
        // Allow for '/' as a base path
        let basePathResolved = $val(basePath) ?? "";
        if (basePathResolved.startsWith('/')) {
            basePathResolved = basePathResolved.substring(1);
        }

        const path = getPath(asUrl.value, basePathResolved);

        if (path !== null) {
            for (const route of $val(routes)) {
                // basePath should be removed from path
                const match = route.match(path, asUrl.value);

                if (match !== pathDoesNotMatch) {
                    return match;
                }
            }
        }

        return $val(fallback)?.();
    });
}
