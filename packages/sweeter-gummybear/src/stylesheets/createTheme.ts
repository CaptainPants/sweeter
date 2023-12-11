import type { AbstractGlobalCssStylesheet } from '@captainpants/sweeter-web';
import { GlobalCssStylesheet } from '@captainpants/sweeter-web';
import { themeOptions } from './themeOptions.js';
import { themeBase } from './base.js';
import { reset } from './reset.js';

export interface ThemeOptions {}

export function createTheme(
    options: ThemeOptions,
): AbstractGlobalCssStylesheet[] {
    const variables = new GlobalCssStylesheet({
        id: 'variables',
        content: `
            :root {
                ${Object.values(themeOptions)
                    .map((val) => `${val.cssVar}: ${val.defaultValue};\n`)
                    .join('')}
            }
        `,
    });

    return [reset, variables, themeBase];
}
