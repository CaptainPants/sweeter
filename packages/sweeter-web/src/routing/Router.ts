import {
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { $derived, $val } from '@captainpants/sweeter-core';

import { pathDoesNotMatch } from './pathDoesNotMatch.js';
import { type Route } from './types.js';

export interface RouterProps {
    basePath: string;
    url: string;

    routes: readonly Route<readonly string[]>[];

    fallback?: (() => JSX.Element) | undefined;
}

export function Router(
    { basePath, url, routes, fallback }: PropertiesMightBeSignals<RouterProps>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init: ComponentInit,
): JSX.Element {
    // TODO: currently not using basePath
    const asUrl = $derived(() => new URL($val(url)));

    return $derived(() => {
        const path = asUrl.value.pathname; // Should use $val(basePath) to create a root relative path;

        for (const route of $val(routes)) {
            // basePath should be removed from path
            const match = route.match(path, asUrl.value);

            if (match !== pathDoesNotMatch) {
                return match;
            }
        }

        return $val(fallback)?.();
    });
}
