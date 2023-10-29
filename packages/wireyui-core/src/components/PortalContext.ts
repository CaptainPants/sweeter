import { Context } from '../context/Context.js';

export interface PortalContextType {
    render(
        target: JSX.PortalHostElement,
        render: () => JSX.Element,
    ): () => void;
}

export const PortalContext = new Context<PortalContextType>('Portal', {
    render: () => {
        throw new TypeError(
            'No PortalContext set, please wrap your element in a Portal',
        );
    },
});
