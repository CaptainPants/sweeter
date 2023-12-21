import type { PropertiesMightBeSignals } from '@captainpants/sweeter-core';
import { $calc, $val } from '@captainpants/sweeter-core';
import type { Route } from './types.js';

export interface RouterProps {
    path: string;

    routes: readonly Route<readonly string[]>[];
}

export function Router({
    path,
    routes,
}: PropertiesMightBeSignals<RouterProps>): JSX.Element {
    return $calc(() => {
        const pathResolved = $val(path);

        for (const route of $val(routes)) {
            const match = route.route.match(pathResolved);

            if (match) {
                return route.render(match);
            }
        }

        return undefined;
    });
}
