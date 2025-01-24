/* @jsxImportSource .. */

import {
    $derived,
    $lazyComponentType,
    $mutable,
    type Component,
    Suspense,
} from '@serpentis/ptolemy-core';

import { testRender } from '../test/testRender.js';

import { $route } from './$route.js';
import { match, pathTemplate } from './index.js';
import { Router } from './Router.js';

it('General', async () => {
    const routes = [
        $route(pathTemplate`this/is/a/${match.segment}`, () => {
            const Component = $lazyComponentType(() =>
                Promise.resolve<Component<{ text: string }>>((props) => {
                    return `Text: ${props.text}`;
                }),
            );

            return ([_arg], _path, _url) => {
                return <Component text="Test" />;
            };
        }),
    ];

    const path = $mutable('this/is/a/banana');

    const res = testRender(() => (
        <Suspense fallback={() => 'Loading'}>
            {() => (
                <Router
                    routes={routes}
                    fallback={() => 'No match'}
                    url={$derived(() => `https://google.com/${path.value}`)}
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
