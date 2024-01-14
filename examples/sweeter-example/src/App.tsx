import {
    $route,
    Router,
    createLocationSignal,
    pathTemplate,
} from '@captainpants/sweeter-web';
import { type NoProps, type ComponentInit } from '@captainpants/sweeter-core';

import { Page1 } from './Page1.js';
import { Page2 } from './Page2.js';

const routes = () => {
    return [
        $route(pathTemplate`/`, () => () => <Page1 />),
        $route(pathTemplate`/page2`, () => () => <Page2 />),
    ];
};

export function App(props: NoProps, init: ComponentInit) {
    const path = createLocationSignal();

    return <Router routes={routes()} rootRelativePath="/" url={path.signal} />;
}
