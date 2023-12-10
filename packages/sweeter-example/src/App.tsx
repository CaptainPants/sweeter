import {
    Reset,
    createTheme,
    grid,
    forms,
    fill,
} from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import { $calc, $mutable } from '@captainpants/sweeter-core';
import { IncludeStylesheet } from '@captainpants/sweeter-web';

const theme = createTheme({});

export function App(): JSX.Element {
    const value = $mutable('test');
    const nonMutable = $calc(() => value.value);

    return (
        <>
            <Reset />
            <IncludeStylesheet stylesheet={theme} />
            <div>
                <h1>This is a test</h1>
                <div class={grid.container}>
                    <div class={grid.row}>
                        <div class={grid.columns.xs._3}>First:</div>
                        <div class={grid.columns.xs._9}>
                            <input
                                type="text"
                                class={[forms.textbox, fill]}
                                value={value}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            Second:
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                class={[forms.textbox, fill]}
                                value={value}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            Non-mutable:
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                class={[forms.textbox, fill]}
                                value={nonMutable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
