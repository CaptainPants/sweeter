import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { themeOptions } from './themeOptions.js';

export const input = new GlobalCssClass({
    className: 'input',
    content: () => stylesheet`
        padding: .375rem .75rem;
        
        border-color: var(${themeOptions.inputBorderColor.cssVar});
        border-width: var(${themeOptions.inputBorderWidth.cssVar});
        border-radius: var(${themeOptions.inputBorderRadius.cssVar});

        background-color: var(${themeOptions.inputBackgroundColor.cssVar});

        &:focus {
            outline-color: var(${themeOptions.inputFocusOutlineColor.cssVar});
            outline-width: var(${themeOptions.inputFocusOutlineWidth.cssVar});
        }
    `,
});
