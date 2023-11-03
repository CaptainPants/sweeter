import { Context } from '../context/Context.js';
import { type RuntimeRootHostElement } from '../types.js';

export interface RuntimeContextType {
    start(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ): () => void;
}

export const RuntimeContext = new Context<RuntimeContextType>('Runtime', {
    start: () => {
        throw new TypeError('No RuntimeContext set');
    },
});
