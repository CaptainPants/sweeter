import { WebRuntime } from '../runtime/WebRuntime.js';

export interface TestRenderResult {
    readonly nodes: NodeListOf<ChildNode>;
    readonly getHTML: () => string;
    readonly dispose: () => void;
}

/**
 * Convenience function for rendering isolated JSX chunks for unit tests
 * @param callback
 * @returns
 */
export function testRender(callback: () => JSX.Element): TestRenderResult {
    const renderer = new WebRuntime();

    const root = document.createElement('div');

    const dispose = renderer.createRoot(root, callback);

    return {
        nodes: root.childNodes,
        getHTML: () => root.innerHTML,
        dispose,
    };
}
