import {
    type ComponentInit,
    ErrorBoundary,
    type NoProps,
} from '@captainpants/sweeter-core';
import {
    $route,
    getWebRuntime,
    pathTemplate,
    Router,
} from '@captainpants/sweeter-web';
import { createTheme } from '@captainpants/sweeter-web-gummybear';

import { HomePage } from './pages/HomePage.js';
import { Page1 } from './pages/Page1.js';
import { Page2 } from './pages/Page2.js';

const { IncludeThemeStylesheets } = createTheme({});

const routes = () => {
    return [
        $route(pathTemplate`/`, () => () => <HomePage />),
        $route(pathTemplate`/page1`, () => () => <Page1 />),
        $route(pathTemplate`/page2`, () => () => <Page2 />),
    ];
};

export function App(_props: NoProps, _init: ComponentInit) {
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
