import { type Component } from '../types/index.js';

export interface FragmentProps {
    children?: JSX.Element;
}

export const Fragment: Component<FragmentProps> = () => {
    throw new Error(
        'Fragment code should never run, as its handled by the renderer.',
    );
};
