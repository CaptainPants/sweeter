import { GlobalCssClass } from '@captainpants/sweeter-web';
import { createConstantMap } from '../internal/createConstantMap.js';
import { sizeNames, tagNames, variantNames } from '../internal/constants.js';

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
