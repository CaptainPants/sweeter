import {
    GlobalCssClass,
    GlobalCssStylesheet,
    stylesheet,
} from '@captainpants/sweeter-web';
import { themeStructure } from '../themeStructure.js';

export const disabled = new GlobalCssClass({
    className: 'disabled',
});

export const themeBase = new GlobalCssStylesheet({
    id: 'base',
    content: stylesheet`
        body {
            background: var(${themeStructure.bodyBackground.cssVar});
            color: var(${themeStructure.common.fontColor.cssVar});
        }

        option, select {
            background: var(${themeStructure.bodyBackground.cssVar});
        }

        * {
            box-sizing: border-box;
        }

        .${disabled}, :disabled {
            opacity: 0.5;
        }
    `,
});
