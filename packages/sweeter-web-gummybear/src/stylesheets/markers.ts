import { GlobalCssClass } from '@captainpants/sweeter-web';

import { sizeNames, tagNames, variantNames } from '../internal/constants.js';
import { createConstantMap } from '../internal/createConstantMap.js';

export const variants = createConstantMap(
    variantNames,
    (name) => new GlobalCssClass({ className: name }),
);

export const tags = createConstantMap(
    tagNames,
    (name) => new GlobalCssClass({ className: name }),
);

export const sizes = createConstantMap(
    sizeNames,
    (name) => new GlobalCssClass({ className: name }),
);
