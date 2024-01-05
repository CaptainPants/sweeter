import { type PropertiesMightBeSignals } from '@captainpants/sweeter-core';
import { $calc, $val } from '@captainpants/sweeter-core';
import { type Route } from './types.js';
import { pathDoesNotMatch } from './pathDoesNotMatch.js';

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
        const resolvedUrl = $val(url);

        for (const route of $val(routes)) {
            const match = route.match(path, resolvedUrl);

            if (match !== pathDoesNotMatch) {
                return match;
            }
        }

        return undefined;
    });
}
