import { ExecutionContextVariable } from '../executionContext/ExecutionContextVariable.js';
import { type RuntimeRootHostElement } from '../types.js';

export interface Runtime {
    renderOffscreen(content: JSX.Element): JSX.Element;
    createNestedRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ): () => void;
    dispose(): void;
    readonly type: symbol;
}

const currentRuntime = new ExecutionContextVariable<Runtime | undefined>(
    'Runtime',
    undefined,
);

export function callWithRuntime(runtime: Runtime, callback: () => void) {
    return currentRuntime.invokeWith(runtime, callback);
}

export function getRuntime() {
    if (!currentRuntime.current) {
        throw new TypeError('No Runtime set');
    }

    return currentRuntime.current;
}
