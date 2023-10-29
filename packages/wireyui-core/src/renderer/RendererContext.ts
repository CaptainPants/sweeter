import { Context } from '../context/Context.js';

export interface RendererContextType {
    start(
        target: JSX.RendererHostElement,
        render: () => JSX.Element,
    ): () => void;
}

export const RendererContext = new Context<RendererContextType>('Renderer', {
    start: () => {
        throw new TypeError('No RendererContext set');
    },
});
