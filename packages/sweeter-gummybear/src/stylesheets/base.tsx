import { GlobalCssStylesheet } from '@captainpants/sweeter-web';
import { themeOptions } from './themeOptions.js';

export const themeBase = new GlobalCssStylesheet({
    id: 'base',
    content: `
        body {
            background: var(${themeOptions.bodyBackground.cssVar});
            color: var(${themeOptions.fontColor.cssVar});
        }
    `,
});
