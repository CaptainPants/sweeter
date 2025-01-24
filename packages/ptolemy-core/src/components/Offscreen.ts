import { getRuntime } from '../runtime/Runtime.js';
import {
    type Component,
    type MightBeSignal,
    type PropertiesMightBeSignals,
} from '../types.js';

export type OffscreenProps = PropertiesMightBeSignals<{
    children?: JSX.Element;
}>;

export const Offscreen: Component<OffscreenProps> = ({ children }, init) => {
    return init.runtime.renderOffscreen(children);
};

export function $offscreen(content: MightBeSignal<JSX.Element>) {
    return getRuntime().jsx(Offscreen, { children: content });
}
