import {
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { $calc, $val } from '@captainpants/sweeter-core';
import { type Route } from './types.js';
import { pathDoesNotMatch } from './pathDoesNotMatch.js';

export interface RouterProps {
    basePath: string;
    url: string;

    routes: readonly Route<readonly string[]>[];

    fallback?: (() => JSX.Element) | undefined;
}

export function Router(
    { basePath, url, routes, fallback }: PropertiesMightBeSignals<RouterProps>,
    init: ComponentInit,
): JSX.Element {
    const asUrl = $calc(() => new URL($val(url)));

    return $calc(() => {
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
