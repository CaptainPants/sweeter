import { Context } from '../context/Context.js';
import { type RendererHostElement } from '../types.js';

export interface RendererContextType {
    start(target: RendererHostElement, render: () => JSX.Element): () => void;
}

export const RendererContext = new Context<RendererContextType>('Renderer', {
    start: () => {
        throw new TypeError('No RendererContext set');
    },
});
