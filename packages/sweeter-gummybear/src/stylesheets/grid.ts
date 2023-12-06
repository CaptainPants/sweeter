import { GlobalCssClass } from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';
import { columnWidthNames } from './internal/constants.js';

export const columns = createConstantMap(
    columnWidthNames,
    (name) => new GlobalCssClass({ className: name }),
);
