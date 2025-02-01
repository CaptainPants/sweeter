import {
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXResultForComponentOrElementType,
    type PropsAndIntrinsicAttributesFor,
} from '@serpentis/ptolemy-core';

import { getWebRuntime } from './getWebRuntime.js';

export function jsx<
    TComponentType extends ComponentOrIntrinsicElementTypeConstraint,
>(
    type: TComponentType,
    props: PropsAndIntrinsicAttributesFor<TComponentType>,
): JSXResultForComponentOrElementType<TComponentType> {
    const webRuntime = getWebRuntime();
    return webRuntime.jsx<TComponentType>(type, props);
}
