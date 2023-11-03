import { valueOf } from '../index.js';
import { type RuntimeRootHostElement, type Component } from '../types.js';
import { RuntimeContext } from '../runtime/RuntimeContext.js';

export interface PortalProps {
    target: RuntimeRootHostElement;
    children: () => JSX.Element;
}

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const portalContext = RuntimeContext.getCurrent();

    let renderCleanup: (() => void) | undefined;

    init.onMount(() => {
        renderCleanup = portalContext.start(valueOf(target), valueOf(children));

        return () => {
            renderCleanup?.();
            renderCleanup = undefined;
        };
    });

    init.subscribeToChanges([], () => {
        renderCleanup?.();
        renderCleanup = portalContext.start(valueOf(target), valueOf(children));
    });

    // Doesn't render anything
    return undefined;
};
