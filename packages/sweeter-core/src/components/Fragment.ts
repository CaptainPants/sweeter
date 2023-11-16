import type { Component } from '../types.js';

export interface FragmentProps {
    children?: JSX.Element;
}

export const Fragment: Component<FragmentProps> = (props) => {
    return props.children;
};
