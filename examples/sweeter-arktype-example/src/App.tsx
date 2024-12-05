import {
    ThemeProvider,
    createTheme,
} from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    $mutable,
    Suspense,
    type ComponentInit,
    $calc,
    Component,
} from '@captainpants/sweeter-core';
import { exampleData } from '@captainpants/arktype-example-data';
import { Example } from './Example';

const theme = createTheme({});

export const App: Component = (_props, _init) => {
    return (
        <ThemeProvider theme={theme}>
            {() => (
                <Suspense fallback={() => 'Loading...'}>
                    {() => (
                        <Example />
                    )}
                </Suspense>
            )}
        </ThemeProvider>
    );
}
