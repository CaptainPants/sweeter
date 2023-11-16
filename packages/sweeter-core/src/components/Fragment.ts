import type { Component, SignalifyProps } from '../types.js';

export type FragmentProps = SignalifyProps<{
    children?: JSX.Element;
}>;

export const Fragment: Component<FragmentProps> = ({ children }) => {
    return children;
};
