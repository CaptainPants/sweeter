import {
    type PropsWithIntrinsicAttributesFor,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXResultForComponentType,
} from '@captainpants/sweeter-core';
import { getWebRuntime } from './WebRuntime.js';

export function jsx<
    TComponentType extends ComponentOrIntrinsicElementTypeConstraint,
>(
    type: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
): JSXResultForComponentType<TComponentType> {
    const webRuntime = getWebRuntime();
    return webRuntime.jsx<TComponentType>(type, props);
}
