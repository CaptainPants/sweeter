import {
    GlobalCssStylesheet,
    IncludeStylesheet,
} from '@captainpants/sweeter-web';
import type { ThemeOptions } from './ThemeOptions.js';
import { themeBase } from './base.js';
import { reset } from './reset.js';
import {
    themeDefinition,
    type ThemeOptionDefinition,
    type ThemeOptionOrGroupDefinition,
} from './internal/themeOptionDefinitions.js';
import type { Component } from '@captainpants/sweeter-core';

export function createTheme(options: ThemeOptions): Component {
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
    process(themeDefinition);

    const variables = new GlobalCssStylesheet({
        id: 'variables',
        content: `
            :root {
                ${propertiesCss.join('                ')}
            }
        `,
    });

    return () => (
        <IncludeStylesheet stylesheet={[reset, variables, themeBase]} />
    );
}
