import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import { tags } from './tags.js';

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

        &.${tags.primary} {
            background-color: blue;
        }

        &.${tags.danger} {
            background-color: red;
        }
    `,
});
