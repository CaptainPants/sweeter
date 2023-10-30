import { valueOf } from '../index.js';
import { type Component } from '../types.js';
import { RendererContext } from '../renderer/RendererContext.js';

export interface PortalProps {
    target: JSXExt.RendererHostElement;
    children: () => JSX.Element;
}

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const portalContext = RendererContext.getCurrent();

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
