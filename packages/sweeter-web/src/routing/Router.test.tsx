/* @jsxImportSource .. */

import { $mutable } from "@captainpants/sweeter-core";
import { testRender } from "../test/testRender.js"
import { Router } from "./Router.js"
import { match } from "./index.js"
import { route } from "./route.js"
import { type Route } from "./types.js";

it('General', () => {
    const routes: Route<readonly string[]>[] = [
        { 
            route: route`this/is/a/${match.segment}`,
            render: args => {
                return 'Match 1';
            }
        }
    ];

    const path = $mutable('this/is/a/banana');

    const res = testRender(() => <Router 
        routes={routes}
        rootRelativePath={path}
        url={new URL('https://google.com/this/is/a/banana')}
    />);

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});