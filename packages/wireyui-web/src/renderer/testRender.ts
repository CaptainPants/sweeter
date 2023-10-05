import { WebRenderer } from './WebRenderer.js';

export interface TestRenderResult {
    readonly nodes: NodeListOf<ChildNode>;
    readonly dispose: () => void;
}

/**
 * Convenience function for rendering isolated JSX chunks for unit tests
 * @param callback
 * @returns
 */
export function testRender(callback: () => JSX.Element): TestRenderResult {
    const renderer = new WebRenderer();

    const root = document.createElement('div');

    const dispose = renderer.start(root, callback);

    return {
        nodes: root.childNodes,
        dispose,
    };
}
