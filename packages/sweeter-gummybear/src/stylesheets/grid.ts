import { GlobalCssClass } from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';
import {
    breakpointNames,
    breakpointSizes,
    columnWidthNames,
} from './internal/constants.js';
import { varNames } from './vars.js';

export const row = new GlobalCssClass({
    className: 'row',
    content: `
        display: flex;
        flex-direction: row;
        margin-left: calc(-1 * var(${varNames.columnPadding}));
        margin-right: calc(-1 * var(${varNames.columnPadding}));
    `,
});

export const columns = createConstantMap(
    breakpointNames,
    (breakpointName, breakpointIndex) => {
        const breakpointSize = breakpointSizes[breakpointIndex]!;

        if (breakpointSize === undefined) {
            return createConstantMap(
                columnWidthNames,
                (columnSizeName, i) =>
                    new GlobalCssClass({
                        className: columnSizeName + '-' + breakpointName,
                        content: `
                        padding-left: var(${varNames.columnPadding});
                        width: ${(i + 1) * Math.floor(100 / 12)}%;
                    `,
                    }),
            );
        }

        return createConstantMap(
            columnWidthNames,
            (columnSizeName, i) =>
                new GlobalCssClass({
                    className: columnSizeName + '-' + breakpointName,
                    content: `
                    @media (screen and min-width: ${breakpointSize}px) {
                        padding-left: var(${varNames.columnPadding});
                        width: ${(i + 1) * Math.floor(100 / 12)}%;
                    }
                `,
                }),
        );
    },
);
