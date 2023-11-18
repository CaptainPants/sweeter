import {
    type SignalifyProps,
    type RuntimeRootHostElement,
    type Component,
} from '../types.js';
import { getRuntime } from '../runtime/Runtime.js';

export type PortalProps = SignalifyProps<{
    target: RuntimeRootHostElement;
    children: () => JSX.Element;
}>;

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const runtimeContext = getRuntime();

    init.subscribeToChanges(
        [target, children],
        ([target, children]) => {
            return runtimeContext.createNestedRoot(target, children);
        },
        true,
    );

    // Doesn't render anything
    return undefined;
};
