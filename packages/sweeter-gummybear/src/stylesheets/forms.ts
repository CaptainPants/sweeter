import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { themeOptions } from './themeOptions.js';

export const input = new GlobalCssClass({
    className: 'input',
    content: () => stylesheet`
        padding: .375rem .75rem;
        
        border-color: var(${themeOptions.input.borderColor.cssVar});
        border-width: var(${themeOptions.input.borderWidth.cssVar});
        border-radius: var(${themeOptions.input.borderRadius.cssVar});

        background-color: var(${themeOptions.input.backgroundColor.cssVar});

        &:focus {
            outline-color: var(${themeOptions.input.focusOutlineColor.cssVar});
            outline-width: var(${themeOptions.input.focusOutlineWidth.cssVar});
        }
    `,
});
