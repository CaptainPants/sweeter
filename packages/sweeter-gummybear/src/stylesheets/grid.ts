import {
    GlobalCssClass,
    GlobalCssStylesheet,
    StylesheetDependencyProvider,
 StylesheetBuilder, 
 stylesheet} from '@captainpants/sweeter-web';
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
            (columnSizeName, i) =>
                new GlobalCssClass({
                    className: 'col' + columnSizeName + '-' + breakpointName,
                    extraDependencies: dependencies,
                }),
        );
    },
);

const breakpointCss = new StylesheetBuilder();

for (
    let breakpointIndex = 0;
    breakpointIndex < breakpointNames.length;
    ++breakpointIndex
) {
    const breakpointSize = breakpointSizes[breakpointIndex]!;
    const breakpointName = breakpointNames[breakpointIndex]!;

    for (
        let columnIndex = 0;
        columnIndex < columnWidthNames.length;
        ++columnIndex
    ) {
        const columnWidthName = columnWidthNames[columnIndex]!;

        const current = columns[breakpointName][columnWidthName]!;

        if (breakpointSize === undefined) {
            breakpointCss.append(stylesheet`
                .${current} {
                    padding-left: var(${
                        themeDefinition.grid.columnPadding.cssVar
                    });
                    padding-right: var(${
                        themeDefinition.grid.columnPadding.cssVar
                    });
                    flex: 0 0 ${(columnIndex + 1) * Math.floor(100 / 12)}%;
                    width: 100%;
                    max-width: ${(columnIndex + 1) * Math.floor(100 / 12)}%;
                }
            `);
        } else {
            breakpointCss.append(stylesheet`
                .${current} {
                    @media screen and (min-width: ${breakpointSize}px) {
                        padding-left: var(${
                            themeDefinition.grid.columnPadding.cssVar
                        });
                        padding-right: var(${
                            themeDefinition.grid.columnPadding.cssVar
                        });
                        flex: 0 0 ${(columnIndex + 1) * Math.floor(100 / 12)}%;
                        width: 100%;
                        max-width: ${(columnIndex + 1) * Math.floor(100 / 12)}%;
                    }
                }
            `);
        }
    }
}

// All the grid classes are defined in this stylesheet (so we have a circular reference here which is a bit hacky but its fine)
const gridStylesheet = new GlobalCssStylesheet({
    id: 'grid',
    content: breakpointCss.build(),
});

dependencies.addDependency(gridStylesheet).freeze();
