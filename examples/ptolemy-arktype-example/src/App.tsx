//import typescriptLogo from "./typescript.svg";
//import viteLogo from "/vite.svg";
import { Component, Suspense } from '@serpentis/ptolemy-core';
import { createTheme, ThemeProvider } from '@serpentis/ptolemy-web-stardust';

import { Example } from './Example.js';

const theme = createTheme({});

export const App: Component = (_props, _init) => {
    return (
        <ThemeProvider theme={theme}>
            {() => (
                <Suspense fallback={() => 'Loading...'}>
                    {() => <Example />}
                </Suspense>
            )}
        </ThemeProvider>
    );
};
