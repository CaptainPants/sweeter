import {
    $route,
    Router,
    getWebRuntime,
    pathTemplate,
} from '@captainpants/sweeter-web';
import {
    type NoProps,
    type ComponentInit,
    ErrorBoundary,
} from '@captainpants/sweeter-core';

import { HomePage } from './pages/HomePage.js';
import { Page1 } from './pages/Page1.js';
import { Page2 } from './pages/Page2.js';
import { createTheme } from '@captainpants/sweeter-web-gummybear';

const { IncludeThemeStylesheets } = createTheme({});

const routes = () => {
    return [
        $route(pathTemplate`/`, () => () => <HomePage />),
        $route(pathTemplate`/page1`, () => () => <Page1 />),
        $route(pathTemplate`/page2`, () => () => <Page2 />),
    ];
};

export function App(props: NoProps, init: ComponentInit) {
    const path = getWebRuntime().location;

    return (
        <>
            <IncludeThemeStylesheets />
            <ErrorBoundary renderError={(err) => <h1>Error: {String(err)}</h1>}>
                {() => (
                    <Router
                        routes={routes()}
                        basePath="/"
                        url={path}
                        fallback={() => <h1>404</h1>}
                    />
                )}
            </ErrorBoundary>
        </>
    );
}
