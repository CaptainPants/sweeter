import {
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXResultForComponentOrElementType,
    type PropsInputFor,
} from '@serpentis/ptolemy-core';

import { getWebRuntime } from './getWebRuntime.js';

export function jsx<
    TComponentType extends ComponentOrIntrinsicElementTypeConstraint,
>(
    type: TComponentType,
    props: PropsInputFor<TComponentType>,
): JSXResultForComponentOrElementType<TComponentType> {
    const webRuntime = getWebRuntime();
    return webRuntime.jsx<TComponentType>(type, props);
}
