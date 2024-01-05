import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { themeStructure } from '../theme/themeStructure.js';

const focusMixin = stylesheet`
    &:focus {
        outline-color: var(${themeStructure.input.focusOutlineColor.cssVar});
        outline-width: var(${themeStructure.input.focusOutlineWidth.cssVar});
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

            border-color: var(${themeStructure.input.borderColor.cssVar});
            border-width: var(${themeStructure.input.borderWidth.cssVar});
            border-radius: var(${themeStructure.input.borderRadius.cssVar});

            background-color: var(${themeStructure.input.backgroundColor.cssVar});
            color: var(${themeStructure.input.color.cssVar});

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
        
        border-color: var(${themeStructure.input.borderColor.cssVar});
        border-width: var(${themeStructure.input.borderWidth.cssVar});
        border-radius: var(${themeStructure.input.borderRadius.cssVar});

        background-color: var(${themeStructure.input.backgroundColor.cssVar});
        color: var(${themeStructure.input.color.cssVar});

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
