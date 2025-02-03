import { getRuntime } from '../runtime/Runtime.js';
import {
    type Component,
    type MightBeSignal,
    type RuntimeRootHostElement,
} from '../types/index.js';

export interface PortalProps {
    target: RuntimeRootHostElement;
    children?: JSX.Element;
}

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const runtime = init.runtime;

    init.trackSignals([target, children], ([target, children]) => {
        return runtime.createNestedRoot(
            target,
            // Note that we could (easily) allow a callback to be passed for children, but I think the API is cleaner this way
            () => children,
        );
    });

    // Doesn't render anything
    return undefined;
};

export function $portal(
    target: MightBeSignal<RuntimeRootHostElement>,
    children: MightBeSignal<JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(Portal, { target, children });
}
