import { type RuntimeRootHostElement, type Component } from '../types.js';
import { RuntimeContext } from '../runtime/RuntimeContext.js';

export interface PortalProps {
    target: RuntimeRootHostElement;
    children: () => JSX.Element;
}

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const runtimeContext = RuntimeContext.getCurrent();

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
