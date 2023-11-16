import { RuntimeContext } from '../runtime/RuntimeContext.js';
import { type Component } from '../types.js';

export interface OffscreenProps {
    children?: JSX.Element;
}

export const Offscreen: Component<OffscreenProps> = ({ children }, init) => {
    return init.getContext(RuntimeContext).renderOffscreen(children);
};
