import { pathDoesNotMatch } from './pathDoesNotMatch.js';
import { type PathTemplate, type Route } from './types.js';

export interface RouteRenderFunction<TArguments extends readonly string[]> {
    (args: TArguments, path: string, url: URL): JSX.Element;
}

export interface RouteHandler<TArguments extends readonly string[]> {
    render: RouteRenderFunction<TArguments>;
}

export function $route<const TArguments extends readonly string[]>(
    pathTemplate: PathTemplate<TArguments>,
    setup: () => RouteHandler<TArguments> | RouteRenderFunction<TArguments>,
): Route<readonly string[]> {
    const setupResult = setup();
    const render =
        typeof setupResult === 'function' ? setupResult : setupResult.render;

    return {
        pathTemplate: pathTemplate,
        match: (path, url) => {
            const match = pathTemplate.match(path);
            if (match) {
                return render(match, path, url);
            }

            return pathDoesNotMatch;
        },
    };
}
