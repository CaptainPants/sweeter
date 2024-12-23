/* @jsxImportSource .. */

import {
    $lazyComponentType,
    $mutable,
    Suspense,
    type Component,
    $derived,
} from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';
import { Router } from './Router.js';
import { match, pathTemplate } from './index.js';
import { $route } from './$route.js';

it('General', async () => {
    const routes = [
        $route(pathTemplate`/this/is/a/${match.segment}`, () => {
            const Component = $lazyComponentType(() =>
                Promise.resolve<Component<{ text: string }>>((props) => {
                    return `Text: ${props.text}`;
                }),
            );

            return ([arg], path, url) => {
                return <Component text="Test" />;
            };
        }),
    ];

    const path = $mutable('/this/is/a/banana');

    const res = testRender(() => (
        <Suspense fallback={() => 'Loading'}>
            {() => (
                <Router
                    routes={routes}
                    basePath={path}
                    url={$derived(() => `https://google.com${path.value}`)}
                />
            )}
        </Suspense>
    ));

    // LOADING
    expect(res.getHTML()).toMatchSnapshot();

    await new Promise((resolve) => queueMicrotask(() => resolve(void 0)));

    // LOADED
    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
