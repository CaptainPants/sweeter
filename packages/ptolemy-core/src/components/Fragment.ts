import { type Component } from '../types/index.js';

export interface FragmentProps {
    children?: JSX.Element;
}

export const Fragment: Component<FragmentProps> = ({ children }) => {
    return children;
};
