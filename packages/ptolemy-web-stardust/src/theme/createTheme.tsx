import { assertNotNullOrUndefined } from '@serpentis/ptolemy-utilities';
import { GlobalCssStylesheet, IncludeStylesheet } from '@serpentis/ptolemy-web';

import { themeBase } from '../stylesheets/base.js';
import { reset } from '../stylesheets/reset.js';
import {
    type ThemeOptionDefinition,
    type ThemeOptionDefinitionOrGroupDefinition,
    ThemeOptionValueOrGroup,
} from '../types.js';

import { type ThemeOptions, themeStructure } from './themeStructure.js';
import { type Theme } from './types.js';

function isThemeOptionDefinition(
    optOrGroup: unknown,
): optOrGroup is ThemeOptionDefinition {
    return !!(optOrGroup as ThemeOptionDefinition).cssVar;
}

function assertIsThemeOption(
    optOrGroup: unknown,
    path: string | undefined,
): asserts optOrGroup is string | number | undefined {
    if (typeof optOrGroup === 'number' || typeof optOrGroup === 'string') {
        throw new Error(
            `Theme option value expected at path ${path ?? '<root>'}.`,
        );
    }
}

function assertIsObjectOrUndefined(
    thing: unknown,
    path: string | undefined,
): asserts thing is undefined | { readonly [key: string]: unknown } {
    if (thing === undefined || (typeof thing === 'object' && thing !== null)) {
        return;
    }

    throw new Error(`Theme option value expected at path ${path ?? '<root>'}.`);
}

export function createTheme(options: ThemeOptions): Theme {
    const propertiesCss: string[] = [];

    function process(
        obj: ThemeOptionDefinitionOrGroupDefinition,
        options: ThemeOptionValueOrGroup | undefined,
        path: string | undefined,
    ): void {
        if (isThemeOptionDefinition(obj)) {
            assertIsThemeOption(options, path);

            if (obj.defaultValue) {
                propertiesCss.push(
                    obj.cssVar +
                        ':' +
                        String(options ?? obj.defaultValue) +
                        ';\n',
                );
            }
        } else {
            assertIsObjectOrUndefined(options, path);

            for (const key of Object.getOwnPropertyNames(obj)) {
                const nestedPath =
                    path === undefined
                        ? `[${JSON.stringify(key)}]`
                        : path + `[${JSON.stringify(key)}]`;

                const currentProperty:
                    | ThemeOptionDefinitionOrGroupDefinition
                    | undefined = obj[key];
                assertNotNullOrUndefined(currentProperty);
                process(currentProperty, options?.[key], nestedPath);
            }
        }
    }

    process(themeStructure, options, undefined);

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
