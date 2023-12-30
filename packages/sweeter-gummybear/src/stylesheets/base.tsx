import { GlobalCssClass, GlobalCssStylesheet, stylesheet } from '@captainpants/sweeter-web';
import { themeDefinition } from './internal/themeOptionDefinitions.js';

export const disabled = new GlobalCssClass({
    className: 'disabled',
});

export const themeBase = new GlobalCssStylesheet({
    id: 'base',
    content: stylesheet`
        body {
            background: var(${themeDefinition.bodyBackground.cssVar});
            color: var(${themeDefinition.common.fontColor.cssVar});
        }

        option, select {
            background: var(${themeDefinition.bodyBackground.cssVar});
        }

        * {
            box-sizing: border-box;
        }

        .${disabled}, :disabled {
            opacity: 0.5;
        }
    `,
});
