import { getRuntime } from '../index.js';
import {
    type PropertiesMightBeSignals,
    type Component,
    type MightBeSignal,
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
