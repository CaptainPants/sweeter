import { GlobalCssClass } from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';
import { columnWidthNames } from './internal/constants.js';
import { varNames } from './vars.js';

export const row = new GlobalCssClass({
    className: 'row',
    content: `
        display: flex;
        flex-direction: row;
        margin-left: var(0 - ${varNames.columnPadding});
        margin-right: var(0 - ${varNames.columnPadding});
    `,
});

export const columns = createConstantMap(
    columnWidthNames,
    (name) =>
        new GlobalCssClass({
            className: name,
            content: `
            padding-left: ${varNames.columnPadding};
        `,
        }),
);
