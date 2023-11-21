import {
    type PropsWithIntrinsicAttributesFor,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXResultForComponentOrElementType,
} from '@captainpants/sweeter-core';
import { getWebRuntime } from './getWebRuntime.js';

export function jsx<
    TComponentType extends ComponentOrIntrinsicElementTypeConstraint,
>(
    type: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
): JSXResultForComponentOrElementType<TComponentType> {
    const webRuntime = getWebRuntime();
    return webRuntime.jsx<TComponentType>(type, props);
}
