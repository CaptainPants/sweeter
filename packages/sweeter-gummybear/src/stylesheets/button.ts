import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { variants } from './markers.js';
import { themeOptions } from './themeOptions.js';

export const button = new GlobalCssClass({
    className: 'button',
    content: () => stylesheet`
        background-color: white;
        border: solid #e0e0e0 2px;
        border-radius: 4px;
        padding: 4px;
        
        &:hover {
            background-color: #e0e0e0;
        }

        &.${variants.primary} {
            background-color: var(${themeOptions.variants.primary.color.cssVar});
        }

        &.${variants.danger} {
            background-color: var(${themeOptions.variants.danger.color.cssVar});
        }
    `,
});
