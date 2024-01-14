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
        const _rootRelativePathResolved = $val(rootRelativePath);
        const urlResolved = $val(url);

        for (const route of $val(routes)) {
            // rootRelativePathResolved should be removed from path
            const match = route.match(urlResolved.pathname, urlResolved);

            if (match !== pathDoesNotMatch) {
                return match;
            }
        }

        return undefined;
    });
}
