import type { AbstractGlobalCssStylesheet } from '@captainpants/sweeter-web';
import { GlobalCssStylesheet } from '@captainpants/sweeter-web';
import type { ThemeOption, ThemeOptionOrGroup } from './themeOptions.js';
import { themeOptions } from './themeOptions.js';
import { themeBase } from './base.js';
import { reset } from './reset.js';

export interface ThemeOptions {}

export function createTheme(
    options: ThemeOptions,
): AbstractGlobalCssStylesheet[] {
    const propertiesCss: string[] = [];
    function process(obj: ThemeOptionOrGroup) {
        if ((obj as ThemeOption).cssVar) {
            const typed = obj as ThemeOption;
            if (typed.defaultValue) {
                propertiesCss.push(
                    typed.cssVar,
                    ':',
                    String(typed.defaultValue),
                    ';',
                );
            }
        } else {
            for (const key of Object.getOwnPropertyNames(obj)) {
                process((obj as Record<string, ThemeOption>)[key]!);
            }
        }
    }
    process(themeOptions);

    const variables = new GlobalCssStylesheet({
        id: 'variables',
        content: `
            :root {
                ${propertiesCss.join('\n')}
            }
        `,
    });

    return [reset, variables, themeBase];
}
