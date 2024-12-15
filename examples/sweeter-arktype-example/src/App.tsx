import {
    ThemeProvider,
    createTheme,
} from '@captainpants/sweeter-web-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    Suspense,
    Component,
} from '@captainpants/sweeter-core';
import { Example } from './Example';

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
