import type { Route } from './types.js';

export function $route<const TArguments extends readonly string[], TProps>(
    route: Route<TArguments, TProps>,
): Route<readonly string[], unknown> {
    return route as Route<readonly string[], unknown>;
}
