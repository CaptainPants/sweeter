import { createWebRuntime } from '../runtime/index.js';

export interface TestRenderResult {
    readonly nodes: NodeListOf<ChildNode>;
    readonly getHTML: () => string;
    readonly dispose: () => void;
}

/**
 * Convenience function for rendering isolated JSX chunks for unit tests
 * @param render
 * @returns
 */
export function testRender(render: () => JSX.Element): TestRenderResult {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const runtime = createWebRuntime({
        root: root,
        render: render,
        classNameFormat: (_, className) => className,
    });

    return {
        nodes: root.childNodes,
        getHTML: () => root.innerHTML,
        dispose: () => {
            runtime.dispose();
            root.remove();
        },
    };
}
