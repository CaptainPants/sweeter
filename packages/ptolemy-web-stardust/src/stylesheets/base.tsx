import { GlobalCssStylesheet, stylesheet } from '@serpentis/ptolemy-web';

import { themeStructure } from '../theme/themeStructure.js';

import { tags } from './markers.js';

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

        .${tags.disabled}, :disabled {
            opacity: 0.5;
        }
        
        .${tags.fillWidth} {
            width: 100%;
        }

        .${tags.invalid} {
            border-color: red;
        }
    `,
});
