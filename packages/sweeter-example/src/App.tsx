import {
    Reset,
    createTheme,
    grid,
    forms,
    fillWidth,
    button,
    variants,
    tags,
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
                                class={[forms.input, fillWidth]}
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
                                class={[forms.input, fillWidth]}
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
                                class={[forms.input, fillWidth]}
                                value={nonMutable}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            Button:
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <button
                                class={[button, variants.primary]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Primary
                            </button>
                            <button
                                class={[button, variants.primary, tags.outline]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Primary (Outline)
                            </button>
                            <button
                                class={[button, variants.secondary]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Secondary
                            </button>
                            <button
                                class={[button, variants.success]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Success
                            </button>
                            <button
                                class={[button, variants.danger]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Danger
                            </button>
                            <button
                                class={[button, variants.warning]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Warning
                            </button>
                            <button
                                class={[button, variants.dark]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Dark
                            </button>
                            <button
                                class={[button, variants.light]}
                                onclick={() => {
                                    alert('Clicked!');
                                }}
                            >
                                Light
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
