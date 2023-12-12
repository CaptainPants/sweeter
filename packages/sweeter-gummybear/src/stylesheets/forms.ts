import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { themeDefinition } from './internal/themeOptionDefinitions.js';

export const input = new GlobalCssClass({
    className: 'input',
    content: () => stylesheet`
        padding: .375rem .75rem;
        
        border-color: var(${themeDefinition.input.borderColor.cssVar});
        border-width: var(${themeDefinition.input.borderWidth.cssVar});
        border-radius: var(${themeDefinition.input.borderRadius.cssVar});

        background-color: var(${themeDefinition.input.backgroundColor.cssVar});

        &:focus {
            outline-color: var(${themeDefinition.input.focusOutlineColor.cssVar});
            outline-width: var(${themeDefinition.input.focusOutlineWidth.cssVar});
        }
    `,
});
