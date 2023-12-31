import {
    createTheme,
    grid,
    forms,
    button,
    variants,
    tags,
} from '@captainpants/sweeter-gummybear';

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import {
    $mutable,
    $propertyOf,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { type ThreeValueBoolean } from '@captainpants/sweeter-web';

const Theme = createTheme({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function App(props: {}, init: ComponentInit): JSX.Element {
    const state = $mutable({
        textInput: 'test',
        select: 'Option 3',
        checked: false as ThreeValueBoolean,
    });

    const ids = {
        textMutable1: init.nextId(),
        textMutable2: init.nextId(),
        textNonMutable: init.nextId(),
        textDisabled: init.nextId(),
        textReadonly: init.nextId(),

        select: init.nextId(),
        selectDisabled: init.nextId(),
        checkbox: init.nextId(),
        checkboxDisabled: init.nextId(),

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
                        <h2 class={grid.columns.xs._12}>Text input:</h2>
                    </div>
                    <div class={grid.row}>
                        <div class={grid.columns.xs._3}>
                            <label for={ids.textMutable1} class={forms.label}>
                                Text input:
                            </label>
                        </div>
                        <div class={grid.columns.xs._9}>
                            <input
                                id={ids.textMutable1}
                                type="text"
                                class={[forms.input, tags.fillWidth]}
                                bind:value={$propertyOf(state, 'textInput')}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._12, grid.columns.sm._6]}>
                            <label for={ids.textMutable2} class={forms.label}>
                                Text input (bound to the same backing field):
                            </label>
                        </div>
                        <div class={[grid.columns.xs._12, grid.columns.sm._6]}>
                            <input
                                type="text"
                                id={ids.textMutable2}
                                class={[forms.input, tags.fillWidth]}
                                bind:value={$propertyOf(state, 'textInput')}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label
                                for={ids.textDisabled}
                                class={[forms.label, tags.disabled]}
                            >
                                Disabled text input (bound to the same backing
                                field):
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                id={ids.textDisabled}
                                class={[forms.input, tags.fillWidth]}
                                bind:value={$propertyOf(state, 'textInput')}
                                disabled
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.textReadonly} class={[forms.label]}>
                                Readonly text input (bound to the same backing
                                field):
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                id={ids.textReadonly}
                                class={[forms.input, tags.fillWidth]}
                                bind:value={$propertyOf(state, 'textInput')}
                                readonly
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.textNonMutable} class={forms.label}>
                                Text input bound to a read only signal:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="text"
                                id={ids.textNonMutable}
                                class={[forms.input, tags.fillWidth]}
                                value={$propertyOf(state, 'textInput', true)}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <h2 class={grid.columns.xs._12}>Select:</h2>
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
                                class={[forms.select, tags.fillWidth]}
                                bind:value={$propertyOf(state, 'select')}
                            >
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label
                                for={ids.select}
                                class={[forms.label, tags.disabled]}
                            >
                                Disabled select:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <select
                                id={ids.select}
                                class={[forms.select, tags.fillWidth]}
                                bind:value={$propertyOf(state, 'select')}
                                disabled
                            >
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label for={ids.checkbox} class={forms.label}>
                                Checkbox:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="checkbox"
                                id={ids.checkbox}
                                class={[forms.input]}
                                bind:checked={$propertyOf(state, 'checked')}
                            />
                        </div>
                    </div>
                    <div class={grid.row}>
                        <div class={[grid.columns.xs._3, grid.columns.sm._6]}>
                            <label
                                for={ids.checkboxDisabled}
                                class={[forms.label, tags.disabled]}
                            >
                                Disabled checkbox:
                            </label>
                        </div>
                        <div class={[grid.columns.xs._9, grid.columns.sm._6]}>
                            <input
                                type="checkbox"
                                id={ids.checkbox}
                                class={[forms.input]}
                                bind:checked={$propertyOf(state, 'checked')}
                                disabled
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
