import type { Component, PropertiesMightBeSignals } from '../types.js';

export type FragmentProps = PropertiesMightBeSignals<{
    children?: JSX.Element;
}>;

export const Fragment: Component<FragmentProps> = ({ children }) => {
    return children;
};
