import { Component, JSXElement } from '@captainpants/wireyui-core';

export interface FragmentProps {
    children?: JSXElement;
}

/**
 * TODO: a real implementation, currently its just a div
 * @param props
 * @param context
 * @returns
 */
export const Fragment: Component<FragmentProps> = (props, context) => {
    throw new TypeError('Fragments should never be rendered directly.');
};
