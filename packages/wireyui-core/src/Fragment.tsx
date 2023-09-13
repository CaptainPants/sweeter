import { Component, JSXElement } from '@captainpants/wireyui-core';

export interface FragmentProps {
    children?: JSXElement;
}

/**
 * @param props
 * @param context
 * @returns
 */
export const Fragment: Component<FragmentProps> = (props, context) => {
    return props.children;
};
