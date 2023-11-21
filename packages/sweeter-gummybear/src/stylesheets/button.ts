import { GlobalCssClass } from '@captainpants/sweeter-web';

export const button = new GlobalCssClass({
    className: 'button',
    content: `
        background-color: white;
        border: solid #e0e0e0 2px;
        border-radius: 4px;
        padding: 4px;
        
        &:hover {
            background-color: #e0e0e0;
        }
    `,
});
