/* @jsxImportSource .. */

import {
    $lazyComponent,
    $mutable,
    type Component,
} from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';
import { Router } from './Router.js';
import { type Route, match, pathTemplate } from './index.js';
import { $route } from './$route.js';

it('General', () => {
    const routes: Route<readonly string[]>[] = [
        $route(pathTemplate`this/is/a/${match.segment}`, () => {
            const Component = $lazyComponent(() =>
                Promise.resolve<Component<{ text: string }>>((props) => {
                    return `Text: ${props.text}`;
                }),
            );

            return ([arg], path, url) => {
                return <Component text="Test" />;
            };
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
