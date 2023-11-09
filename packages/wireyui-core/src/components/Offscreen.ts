import { type Component, RuntimeContext } from '../index.js';

export interface OffscreenProps {
    children?: JSX.Element;
}

export const Offscreen: Component<OffscreenProps> = ({ children }, init) => {
    return init.getContext(RuntimeContext).renderOffscreen(children);
};
