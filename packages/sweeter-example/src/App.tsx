import {
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

import {
    $calc,
    $mutable,
    type ComponentInit,
} from '@captainpants/sweeter-core';

const Theme = createTheme({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function App(props: {}, init: ComponentInit): JSX.Element {
    const value = $mutable('test');
    const nonMutable = $calc(() => value.value);

    const dropdown = $mutable<string>('Option 3');

    const ids = {
        first: init.nextId(),
        second: init.nextId(),
        nonMutable: init.nextId(),
        disabled: init.nextId(),
        select: init.nextId(),
        checkbox: init.nextId(),
        radiobuttons: init.nextId(),
        buttons: init.nextId(),
    } as const;

    return (
        <>
            <Theme />
            <div>
                <h1>This is a test</h1>
                <div class={grid.container}>
                    <div class={grid.row}>
                        <div class={grid.columns.xs._3}>
                            <label for={ids.first} class={forms.label}>
                                First:
                            </label>
                        </div>
                        <div class={grid.columns.xs._9}>
                            <input
                                id={ids.first}
                                type="text"
                                class={[forms.input, fillWidth]}
                                value={value}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.second} class={forms.label}>
                                Second:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                id={ids.second}
                                class={[forms.input, fillWidth]}
                                value={value}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.nonMutable} class={forms.label}>
                                Non-mutable:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                disabled
                                id={ids.nonMutable}
                                class={[forms.input, fillWidth]}
                                value={nonMutable}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label
                                for={ids.disabled}
                                class={[forms.label, forms.disabled]}
                            >
                                Disabled:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                id={ids.disabled}
                                class={[forms.input, fillWidth, forms.disabled]}
                                value={nonMutable}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.select} class={forms.label}>
                                Select:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <select
                                id={ids.select}
                                class={[forms.select, fillWidth]}
                                value={dropdown}
                            >
                                015.
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.checkbox} class={forms.label}>
                                Select:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="checkbox"
                                id={ids.checkbox}
                                class={[forms.input]}
                                value={dropdown}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._12, grid.columns.sm._6]}>
                            <label class={forms.label}>Button:</label>
                        </div>
                        <div class={[grid.columns.xs._12, grid.columns.sm._6]}>
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
