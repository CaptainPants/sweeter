export type ThemeOptionDefinition = {
    cssVar: string;
    defaultValue: string | number | undefined;
};

export type ThemeOptionOrGroupDefinition =
    | ThemeOptionDefinition
    | { [key: string]: ThemeOptionOrGroupDefinition };
