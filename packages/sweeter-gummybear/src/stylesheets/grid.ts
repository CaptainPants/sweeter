import {
    GlobalCssClass,
    GlobalCssStylesheet,
    StylesheetDependencyProvider,
    StylesheetFragmentBuilder,
    stylesheet,
} from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';
import {
    breakpointNames,
    breakpointSizes,
    columnWidthNames,
} from './internal/constants.js';
import { themeDefinition } from './internal/themeOptionDefinitions.js';

export const container = new GlobalCssClass({
    className: 'container',
    content: `
        max-width: 900px;
        margin: 0 auto;
    `,
});

export const row = new GlobalCssClass({
    className: 'row',
    content: `
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        margin-left: calc(-1 * var(${themeDefinition.grid.columnPadding.cssVar}));
        margin-right: calc(-1 * var(${themeDefinition.grid.columnPadding.cssVar}));
        margin-bottom: var(${themeDefinition.grid.rowBottomPadding.cssVar});
    `,
});

const dependencies = new StylesheetDependencyProvider();

const underscore = '_'.charCodeAt(0);

export const columns = createConstantMap(
    breakpointNames,
    (breakpointName, breakpointIndex) => {
        const breakpointSize = breakpointSizes[breakpointIndex]!;

        if (breakpointSize === undefined) {
            return createConstantMap(
                columnWidthNames,
                (columnSizeName, i) =>
                    new GlobalCssClass({
                        className: 'col-' + breakpointName,
                        extraDependencies: dependencies,
                    }),
            );
        }


        return createConstantMap(
            columnWidthNames,
            (columnSizeName, i) => {
                // Numbered columns are prefixed with _ to make them valid identifiers
                const columnNameWithoutUnderscore = (columnSizeName.charCodeAt(0) == underscore ? columnSizeName.substring(1) : columnSizeName);
                const className = 'col-' + columnNameWithoutUnderscore + '-' + breakpointName;

                return new GlobalCssClass({
                    className:
                        className,
                    extraDependencies: dependencies,
                });
            },
        );
    },
);

const gridStylesheetCss = new StylesheetFragmentBuilder();
const allColClasses: GlobalCssClass[] = [];

for (
    let breakpointIndex = 0;
    breakpointIndex < breakpointNames.length;
    ++breakpointIndex
) {
    const breakpointSize = breakpointSizes[breakpointIndex]!;
    const breakpointName = breakpointNames[breakpointIndex]!;

    const thisBreakpointCss = new StylesheetFragmentBuilder();

    for (
        let columnIndex = 0;
        columnIndex < columnWidthNames.length;
        ++columnIndex
    ) {
        const columnWidthName = columnWidthNames[columnIndex]!;

        const currentClass = columns[breakpointName][columnWidthName]!;
        allColClasses.push(currentClass);

        if (columnWidthName === 'auto') {
            // Auto-size
            thisBreakpointCss.appendLine(stylesheet`
                .${currentClass} {
                    flex: 1 1;
                }
            `);
        } else {
            thisBreakpointCss.appendLine(stylesheet`
                .${currentClass} {
                    flex: 0 0 ${(columnIndex + 1) * Math.floor(100 / 12)}%;
                    width: 100%;
                    max-width: ${(columnIndex + 1) * Math.floor(100 / 12)}%;
                }
            `);
        }
    }

    // No media query
    if (breakpointSize === undefined) {
        gridStylesheetCss.appendLine(thisBreakpointCss.build());
    }
    // Media query
    else {
        gridStylesheetCss.appendLine(stylesheet`
            @media screen and (min-width: ${breakpointSize}px) {
                ${thisBreakpointCss.build()}
            }
        `);
    }
}

// == Stuff thats common to all columns:
for (let i = 0; i < allColClasses.length; ++i) {
    if (i !== 0) {
        gridStylesheetCss.append(', ');
    }

    gridStylesheetCss.append(stylesheet`.${allColClasses[i]!}`);
}
gridStylesheetCss.appendLine(stylesheet`
    {
        padding-left: var(${themeDefinition.grid.columnPadding.cssVar});
        padding-right: var(${themeDefinition.grid.columnPadding.cssVar});
    }
`);
// == END OF Stuff thats common to all columns

// All the grid classes are defined in this stylesheet (so we have a circular reference here which is a bit hacky but its fine)
export const gridStylesheet = new GlobalCssStylesheet({
    id: 'grid',
    content: gridStylesheetCss.build(),
});

dependencies.addDependency(gridStylesheet).freeze();
