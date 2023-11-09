import { ExecutionContextVariable } from '../executionContext/ExecutionContextVariable.js';
import { stringifyForDiagnostics } from '../index.js';

interface ContextNode {
    id: symbol;
    value: unknown;
    type: Context<unknown>;
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

    /**
     * Non-unique name.
     */
    readonly name: string;

    /**
     * Unique symbol representing the context type, based on name.
     */
    readonly id: symbol;

    readonly defaultValue: T;

    replace(value: T): () => void {
        return contextStack.replace({
            id: this.id,
            value: value,
            type: this,
            parent: contextStack.current,
        });
    }

    invokeWith<TCallbackResult>(
        value: T,
        callback: () => TCallbackResult,
    ): TCallbackResult {
        return contextStack.invokeWith(
            {
                id: this.id,
                value: value,
                type: this,
                parent: contextStack.current,
            },
            callback,
        );
    }

    getCurrent(): T {
        let current: ContextNode | undefined = contextStack.current;
        while (current) {
            // We could alternatively use the 'type' but whatever
            if (current.id === this.id) {
                return current.value as T;
            }

            current = current.parent;
        }
        return this.defaultValue;
    }
}

export interface ContextSummary {
    readonly name: string;
    readonly value: unknown;
    readonly type: Context<unknown>;
}

export type ContextType<T> = T extends Context<infer S> ? S : never;

export function getContexts(): ContextSummary[] {
    const res: ContextSummary[] = [];

    let current = contextStack.current;
    while (current) {
        res.push({
            name: current.type.name,
            type: current.type,
            value: current.value,
        });

        current = current.parent;
    }

    return res;
}

export function getContextSummary(): string {
    const res: string[] = [];

    let current = contextStack.current;
    while (current) {
        res.push(
            `${String(current.id)}: ${stringifyForDiagnostics(current.value)}`,
        );

        current = current.parent;
    }

    return res.join('\r\n');
}
