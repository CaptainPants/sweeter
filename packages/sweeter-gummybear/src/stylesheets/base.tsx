import { GlobalCssStylesheet } from '@captainpants/sweeter-web';
import { themeDefinition } from './internal/themeOptionDefinitions.js';

export const themeBase = new GlobalCssStylesheet({
    id: 'base',
    content: `
        body {
            background: var(${themeDefinition.bodyBackground.cssVar});
            color: var(${themeDefinition.common.fontColor.cssVar});
        }
    `,
});
