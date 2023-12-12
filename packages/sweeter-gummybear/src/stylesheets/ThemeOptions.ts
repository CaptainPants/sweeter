import type { themeDefinition } from './internal/themeOptionDefinitions.js';

type ExtractOptionsFromDefinition<T> = T extends {
    cssVar: string;
    defaultValue: infer S;
}
    ? S
    : { -readonly [Key in keyof T]?: ExtractOptionsFromDefinition<T[Key]> };

export type ThemeOptions = ExtractOptionsFromDefinition<typeof themeDefinition>;
