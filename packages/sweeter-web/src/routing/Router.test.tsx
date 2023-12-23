/* @jsxImportSource .. */

import {
    $lazyComponent,
    $mutable,
    type Component,
} from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';
import { Router } from './Router.js';
import { match, pathTemplate } from './index.js';
import { $route } from './$route.js';

it('General', () => {
    const routes = [
        $route({
            path: pathTemplate`this/is/a/${match.segment}`,
            prepareProps: ([segment0]) => {
                return { texts: 'Hello' };
            },
            Component: $lazyComponent(() =>
                Promise.resolve<Component<{ texts: string }>>((props) => {
                    return `Text: ${props.texts}`;
                }),
            ),
        }),
    ];

    const path = $mutable('this/is/a/banana');

    const res = testRender(() => (
        <Router
            routes={routes}
            rootRelativePath={path}
            url={new URL('https://google.com/this/is/a/banana')}
        />
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
