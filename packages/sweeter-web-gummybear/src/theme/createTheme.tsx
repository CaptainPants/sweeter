import {
    GlobalCssStylesheet,
    IncludeStylesheet,
} from '@captainpants/sweeter-web';

import { themeBase } from '../stylesheets/base.js';
import { reset } from '../stylesheets/reset.js';
import {
    type ThemeOptionDefinition,
    type ThemeOptionOrGroupDefinition,
} from '../types.js';

import { type ThemeOptions, themeStructure } from './themeStructure.js';
import { type Theme } from './types.js';

export function createTheme(options: ThemeOptions): Theme {
    const propertiesCss: string[] = [];
    function process(obj: ThemeOptionOrGroupDefinition) {
        if ((obj as ThemeOptionDefinition).cssVar) {
            const typed = obj as ThemeOptionDefinition;
            if (typed.defaultValue) {
                propertiesCss.push(
                    typed.cssVar + ':' + String(typed.defaultValue) + ';\n',
                );
            }
        } else {
            for (const key of Object.getOwnPropertyNames(obj)) {
                process((obj as Record<string, ThemeOptionDefinition>)[key]!);
            }
        }
    }
    process(themeStructure);

    const variables = new GlobalCssStylesheet({
        id: 'variables',
        content: `
            :root {
                ${propertiesCss.join('                ')}
            }
        `,
    });

    return {
        IncludeThemeStylesheets: () => (
            <IncludeStylesheet stylesheet={[reset, variables, themeBase]} />
        ),
    };
}
