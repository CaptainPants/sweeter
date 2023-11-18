import { getRuntime } from '../runtime/Runtime.js';
import { type SignalifyProps, type Component } from '../types.js';

export type OffscreenProps = SignalifyProps<{
    children?: JSX.Element;
}>;

export const Offscreen: Component<OffscreenProps> = ({ children }, init) => {
    return getRuntime().renderOffscreen(children);
};
