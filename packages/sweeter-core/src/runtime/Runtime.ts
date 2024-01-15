import { ExecutionContextVariable } from '../executionContext/ExecutionContextVariable.js';
import {
    type JSXResultForComponentOrElementType,
    type ComponentOrIntrinsicElementTypeConstraint,
    type RuntimeRootHostElement,
    type PropsWithIntrinsicAttributesFor,
} from '../types.js';

export interface Runtime {
    renderOffscreen(content: JSX.Element): JSX.Element;
    createNestedRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ): () => void;
    jsx<TComponentType extends ComponentOrIntrinsicElementTypeConstraint>(
        type: TComponentType,
        /**
         * Note that middleware is allowed to modify the props object, the
         * caller needs to make a defensive copy if they are reusing it.
         */
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSXResultForComponentOrElementType<TComponentType>;
    dispose(): void;
    readonly type: symbol;
}

const currentRuntime = new ExecutionContextVariable<Runtime | undefined>(
    'Runtime',
    undefined,
);

export function callWithRuntime<T = void>(runtime: Runtime, callback: () => T): T {
    return currentRuntime.invokeWith(runtime, callback);
}

export function getRuntime() {
    if (!currentRuntime.current) {
        throw new TypeError('No Runtime set');
    }

    return currentRuntime.current;
}
