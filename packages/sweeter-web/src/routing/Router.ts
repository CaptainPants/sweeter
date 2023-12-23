import type { PropertiesMightBeSignals } from '@captainpants/sweeter-core';
import { $calc, $val, getRuntime } from '@captainpants/sweeter-core';
import type { Route } from './types.js';

export interface RouterProps {
    rootRelativePath: string;
    url: URL;

    routes: readonly Route<readonly string[], unknown>[];
}

export function Router({
    rootRelativePath,
    url,
    routes,
}: PropertiesMightBeSignals<RouterProps>): JSX.Element {
    return $calc(() => {
        const path = $val(rootRelativePath);

        for (const route of $val(routes)) {
            const match = route.path.match(path);

            if (match) {
                const props = route.prepareProps(match, path, $val(url));

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return getRuntime().jsx(route.Component, props as any);
            }
        }

        return undefined;
    });
}
