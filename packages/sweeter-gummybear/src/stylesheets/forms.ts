import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { themeDefinition } from './internal/themeOptionDefinitions.js';

const focusMixin = stylesheet`
    &:focus {
        outline-color: var(${themeDefinition.input.focusOutlineColor.cssVar});
        outline-width: var(${themeDefinition.input.focusOutlineWidth.cssVar});
        outline-style: solid;
    }
`;
const inputPaddingMixin = stylesheet`
    padding: .375rem .75rem;
`;

export const input = new GlobalCssClass({
    className: 'input',
    content: () => stylesheet`
        &:not([type=checkbox]):not([type=radio]) {
            ${inputPaddingMixin}

            border-color: var(${themeDefinition.input.borderColor.cssVar});
            border-width: var(${themeDefinition.input.borderWidth.cssVar});
            border-radius: var(${themeDefinition.input.borderRadius.cssVar});

            background-color: var(${themeDefinition.input.backgroundColor.cssVar});
            color: var(${themeDefinition.input.color.cssVar});

            ${focusMixin}
        }

        &[type=checkbox] {
            padding: 10px;
        }

        &[type=radio] {
            padding: 10px;
        }
    `,
});

export const select = new GlobalCssClass({
    className: 'select',
    content: () => stylesheet`
        ${inputPaddingMixin}
        
        border-color: var(${themeDefinition.input.borderColor.cssVar});
        border-width: var(${themeDefinition.input.borderWidth.cssVar});
        border-radius: var(${themeDefinition.input.borderRadius.cssVar});

        background-color: var(${themeDefinition.input.backgroundColor.cssVar});
        color: var(${themeDefinition.input.color.cssVar});

        ${focusMixin}

        > option {
            ${inputPaddingMixin}
        }
    `,
});

export const label = new GlobalCssClass({
    className: 'label',
    content: () => stylesheet`
        ${inputPaddingMixin}

        // to match input fields for size
        border: solid transparent 1px; 
        // labels are 'inline' by default
        display: inline-block;
    `,
});
