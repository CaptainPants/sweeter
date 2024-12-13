import {
    type columnWidthIdentifiers,
    type columnWidthNames,
    type columnWidths,
} from './stylesheets/internal/constants.js';

export type ThemeOptionDefinition = {
    cssVar: string;
    defaultValue: string | number | undefined;
};

export type ThemeOptionOrGroupDefinition =
    | ThemeOptionDefinition
    | { [key: string]: ThemeOptionOrGroupDefinition };

export type ColumnWidth = Exclude<
    (typeof columnWidths)[number] | 'auto',
    undefined
>;
export type ColumnWidthIdentifier = (typeof columnWidthIdentifiers)[number];
export type ColumnWidthName = (typeof columnWidthNames)[number];
