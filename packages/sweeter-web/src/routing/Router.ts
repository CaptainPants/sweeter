import type { PropertiesMightBeSignals } from '@captainpants/sweeter-core';
import { $calc, $val } from '@captainpants/sweeter-core';
import type { Route } from './types.js';

export interface RouterProps {
    rootRelativePath: string;
    url: URL;

    routes: readonly Route<readonly string[]>[];
}

export function Router({
    rootRelativePath,
    url,
    routes,
}: PropertiesMightBeSignals<RouterProps>): JSX.Element {
    return $calc(() => {
        const path = $val(rootRelativePath);

        for (const route of $val(routes)) {
            const match = route.route.match(path);

            if (match) {
                return route.render({
                    path: path,
                    url: $val(url),
                    routeArgs: match
                });
            }
        }

        return undefined;
    });
}
