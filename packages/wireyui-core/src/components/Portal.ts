import { isSignal, subscribe, valueOf } from '../index.js';
import { type Component } from '../types.js';
import { PortalContext } from './PortalContext.js';

export interface PortalProps {
    target: JSX.PortalHostElement;
    children: () => JSX.Element;
}

export const Portal: Component<PortalProps> = ({ target, children }, init) => {
    const portalContext = PortalContext.getCurrent();

    init.onLifeCycle(() => {
        let renderCleanup = portalContext.render(
            valueOf(target),
            valueOf(children),
        );

        if (isSignal(children) || isSignal(target)) {
            subscribe([target, children], () => {
                renderCleanup?.();
                renderCleanup = portalContext.render(
                    valueOf(target),
                    valueOf(children),
                );
            });
        }

        return () => {
            renderCleanup?.();
        };
    });

    // Doesn't render anything
    return undefined;
};
