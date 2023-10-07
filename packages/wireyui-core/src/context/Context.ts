import { ExecutionContextVariable } from '../executionContext/ExecutionContextVariable.js';

interface ContextNode {
    id: symbol;
    value: unknown;
    parent: ContextNode | undefined;
}

const contextStack = new ExecutionContextVariable<ContextNode | undefined>(
    'Context:Stack',
    undefined,
);

export class Context<T> {
    constructor(name: string, defaultValue: T) {
        this.name = name;
        this.id = Symbol(name);
        this.defaultValue = defaultValue;
    }

    readonly name: string;

    readonly id: symbol;

    readonly defaultValue: T;

    replace(value: T): () => void {
        return contextStack.replace({
            id: this.id,
            value: value,
            parent: contextStack.current,
        });
    }

    invoke<TCallbackResult>(
        value: T,
        callback: () => TCallbackResult,
    ): TCallbackResult {
        return contextStack.invoke(
            {
                id: this.id,
                value: value,
                parent: contextStack.current,
            },
            callback,
        );
    }

    getCurrent(): T {
        const current = contextStack.current;
        while (current) {
            if (current.id === this.id) {
                return current.value as T;
            }
        }
        return this.defaultValue;
    }
}
