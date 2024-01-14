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
    columnWidthIdentifiers,
    columnWidthNames,
} from './internal/constants.js';
import { themeStructure } from '../theme/themeStructure.js';

export const container = new GlobalCssClass({
    className: 'container',
    content: stylesheet`
        max-width: 900px;
        margin: 0 auto;
    `,
});

export const row = new GlobalCssClass({
    className: 'row',
    content: stylesheet`
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        margin-left: calc(-1 * var(${themeStructure.grid.columnPadding.cssVar}));
        margin-right: calc(-1 * var(${themeStructure.grid.columnPadding.cssVar}));
        margin-bottom: var(${themeStructure.grid.rowBottomPadding.cssVar});
    `,
});

const dependencies = new StylesheetDependencyProvider();

export const columns = createConstantMap(
    breakpointNames,
    (breakpointName, breakpointIndex) => {
        const breakpointSize = breakpointSizes[breakpointIndex]!;

        if (breakpointSize === undefined) {
            return createConstantMap(
                columnWidthIdentifiers,
                (columnSizeName, i) => {
                    return new GlobalCssClass({
                        className: 'col-' + columnWidthNames[i],
                        extraDependencies: dependencies,
                    });
                },
            );
        }

        return createConstantMap(
            columnWidthIdentifiers,
            (columnSizeName, i) => {
                return new GlobalCssClass({
                    className:
                        'col-' + breakpointName + '-' + columnWidthNames[i],
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
        columnIndex < columnWidthIdentifiers.length;
        ++columnIndex
    ) {
        const columnWidthIdentifier = columnWidthIdentifiers[columnIndex]!;

        const currentClass = columns[breakpointName][columnWidthIdentifier]!;
        allColClasses.push(currentClass);

        if (columnWidthIdentifier === 'auto') {
            // Auto-size
            thisBreakpointCss.appendLine(stylesheet`
                .${currentClass} {
                    flex: 1 1;
                }
            `);
        } else {
            thisBreakpointCss.appendLine(stylesheet`
                .${currentClass} {
                    flex: 0 0 ${((columnIndex + 1) * (100 / 12)).toFixed(4)}%;
                    width: 100%;
                    max-width: ${((columnIndex + 1) * (100 / 12)).toFixed(4)}%;
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
        padding-left: var(${themeStructure.grid.columnPadding.cssVar});
        padding-right: var(${themeStructure.grid.columnPadding.cssVar});
    }
`);
// == END OF Stuff thats common to all columns

// All the grid classes are defined in this stylesheet (so we have a circular reference here which is a bit hacky but its fine)
export const gridStylesheet = new GlobalCssStylesheet({
    id: 'grid',
    content: gridStylesheetCss.build(),
});

dependencies.addDependency(gridStylesheet).freeze();
