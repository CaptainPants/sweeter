import {
    createTheme,
    grid,
    forms,
    button,
    variants,
    tags,
    Modal,
    Button,
} from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    type ComponentInit,
} from '@captainpants/sweeter-core';

const { IncludeThemeStylesheets } = createTheme({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function App(props: {}, init: ComponentInit): JSX.Element {
    return (
        <>
            <IncludeThemeStylesheets />
            <div>
                Insert content here
            </div>
        </>
    );
}
