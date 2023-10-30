import { Context } from '../context/Context.js';

export interface RendererContextType {
    start(
        target: JSXExt.RendererHostElement,
        render: () => JSX.Element,
    ): () => void;
}

export const RendererContext = new Context<RendererContextType>('Renderer', {
    start: () => {
        throw new TypeError('No RendererContext set');
    },
});
