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
        ${inputPaddingMixin}

        border-color: var(${themeDefinition.input.borderColor.cssVar});
        border-width: var(${themeDefinition.input.borderWidth.cssVar});
        border-radius: var(${themeDefinition.input.borderRadius.cssVar});

        background-color: var(${themeDefinition.input.backgroundColor.cssVar});
        color: var(${themeDefinition.input.color.cssVar});

        ${focusMixin}
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
