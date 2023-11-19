import { getRuntime } from '../index.js';
import {
    type SignalifyProps,
    type RuntimeRootHostElement,
    type Component,
    type MightBeSignal,
} from '../types.js';

export type PortalProps = SignalifyProps<{
    target: RuntimeRootHostElement;
    children: () => JSX.Element;
}>;

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const runtime = init.runtime;

    init.subscribeToChanges(
        [target, children],
        ([target, children]) => {
            return runtime.createNestedRoot(target, children);
        },
        true,
    );

    // Doesn't render anything
    return undefined;
};

export function $portal(
    target: MightBeSignal<RuntimeRootHostElement>,
    children: MightBeSignal<() => JSX.Element>,
) {
    getRuntime().jsx(Portal, { target, children });
}
