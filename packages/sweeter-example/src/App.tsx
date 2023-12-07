import {
    Reset,
    createTheme,
    grid,
    forms,
} from "@captainpants/sweeter-gummybear";

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import { $mutable } from "@captainpants/sweeter-core";
import { IncludeStylesheet } from "@captainpants/sweeter-web";

const theme = createTheme({});

export function App(): JSX.Element {
    const value = $mutable("test");

    return (
        <>
            <Reset />
            <IncludeStylesheet stylesheet={theme} />
            <div>
                <h1>This is a test</h1>
                <div class={grid.row}>
                    <div class={grid.columns._3}>First:</div>
                    <div class={grid.columns._9}><input type="text" class={forms.textbox} value={value} /></div>
                </div>
                <div class={grid.row}>
                    <div class={grid.columns._3}>Second:</div>
                    <div class={grid.columns._9}><input type="text" class={forms.textbox} value={value} /></div>
                </div>
            </div>
        </>
    );
}
