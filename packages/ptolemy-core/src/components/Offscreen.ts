import { getRuntime } from '../runtime/Runtime.js';
import { type Component, type MightBeSignal } from '../types.js';

export interface OffscreenProps {
    children?: JSX.Element | undefined;
}

export const Offscreen: Component<OffscreenProps> = ({ children }, init) => {
    return init.runtime.renderOffscreen(children);
};

export function $offscreen(content: MightBeSignal<JSX.Element>) {
    return getRuntime().jsx(Offscreen, { children: content });
}
