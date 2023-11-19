import { getRuntime } from '../index.js';
import {
    type SignalifyProps,
    type Component,
    type MightBeSignal,
} from '../types.js';

export type OffscreenProps = SignalifyProps<{
    children?: JSX.Element;
}>;

export const Offscreen: Component<OffscreenProps> = ({ children }, init) => {
    return init.runtime.renderOffscreen(children);
};

export function $offscreen(content: MightBeSignal<JSX.Element>) {
    return getRuntime().jsx(Offscreen, { children: content });
}
