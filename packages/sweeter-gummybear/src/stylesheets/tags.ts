import { GlobalCssClass } from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';

export const tags = createConstantMap(
    ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light'],
    (tag) =>
        new GlobalCssClass({
            className: tag,
        }),
);
