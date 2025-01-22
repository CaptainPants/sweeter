import {
    type columnWidthIdentifiers,
    type columnWidthNames,
    type columnWidths,
} from './stylesheets/internal/constants.js';

export type ThemeOptionDefinition = {
    cssVar: string;
    defaultValue: string | number | undefined;
};

export type ThemeOptionDefinitionGroup = {
    readonly [key: string]: ThemeOptionDefinitionOrGroupDefinition
}

export type ThemeOptionDefinitionOrGroupDefinition =
    | ThemeOptionDefinition
    | ThemeOptionDefinitionGroup;

export type ThemeOptionGroup = { [key: string]: ThemeOptionValueOrGroup }

export type ThemeOptionValueOrGroup =
    | ThemeOptionGroup
    | string
    | number;

export type ColumnWidth = Exclude<
    (typeof columnWidths)[number] | 'auto',
    undefined
>;
export type ColumnWidthIdentifier = (typeof columnWidthIdentifiers)[number];
export type ColumnWidthName = (typeof columnWidthNames)[number];
