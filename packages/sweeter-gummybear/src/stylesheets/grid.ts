import { GlobalCssClass } from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';
import { columnWidthNames } from './internal/constants.js';
import { varNames } from './vars.js';

export const row = new GlobalCssClass({
    className: 'row',
    content: `
        display: flex;
        flex-direction: row;
        margin-left: calc(0 - var(${varNames.columnPadding}));
        margin-right: calc(0 - var(${varNames.columnPadding}));
    `,
});

export const columns = createConstantMap(
    columnWidthNames,
    (name, i) =>
        new GlobalCssClass({
            className: name,
            content: `
            padding-left: var(${varNames.columnPadding});
            width: ${(i + 1) * Math.floor(100 / 12)}%;
        `,
        }),
);
