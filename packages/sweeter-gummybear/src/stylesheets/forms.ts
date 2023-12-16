import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { themeDefinition } from './internal/themeOptionDefinitions.js';

const focusMixin = stylesheet`
    &:focus {
        outline-color: var(${themeDefinition.input.focusOutlineColor.cssVar});
        outline-width: var(${themeDefinition.input.focusOutlineWidth.cssVar});
        outline-style: solid;
    }
`;

export const input = new GlobalCssClass({
    className: 'input',
    content: () => stylesheet`
        padding: .375rem .75rem;
        
        border-color: var(${themeDefinition.input.borderColor.cssVar});
        border-width: var(${themeDefinition.input.borderWidth.cssVar});
        border-radius: var(${themeDefinition.input.borderRadius.cssVar});

        background-color: var(${themeDefinition.input.backgroundColor.cssVar});

        ${focusMixin}
    `,
});

export const select = new GlobalCssClass({
    className: 'select',
    content: () => stylesheet`
        padding: .375rem .75rem;
        
        border-color: var(${themeDefinition.input.borderColor.cssVar});
        border-width: var(${themeDefinition.input.borderWidth.cssVar});
        border-radius: var(${themeDefinition.input.borderRadius.cssVar});

        background-color: var(${themeDefinition.input.backgroundColor.cssVar});

        ${focusMixin}
    `,
});

export const label = new GlobalCssClass({
    className: 'label',
    content: () => stylesheet`
        padding: .375rem .75rem;
        margin: 2px;
        // to match input fields for size
        border: solid transparent 1px; 
        // labels are 'inline' by default
        display: inline-block; 
    `,
});
