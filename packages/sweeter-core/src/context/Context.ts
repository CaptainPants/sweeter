import { ExecutionContextVariable } from '../executionContext/ExecutionContextVariable.js';
import { stringifyForDiagnostics } from '../utility/stringifyForDiagnostics.js';

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

/**
 * @category Context
 */
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
        return findContext(contextStack.current, this);
    }

    /**
     * Store the top of the Context stack for later searches. This is intentionally cheap to call.
     * @returns
     */
    static createSnapshot(): <T>(context: Context<T>) => T {
        const snapshot = contextStack.current;
        return (context) => {
            return findContext(snapshot, context);
        };
    }
}

export interface ContextSummary {
    readonly name: string;
    readonly value: unknown;
    readonly type: Context<unknown>;
}

export type ContextType<T> = T extends Context<infer S> ? S : never;

function findContext<T>(
    snapshot: ContextNode | undefined,
    context: Context<T>,
): T {
    let current: ContextNode | undefined = snapshot;
    while (current) {
        // We could alternatively use the 'type' but whatever
        if (current.id === context.id) {
            return current.value as T;
        }

        current = current.parent;
    }
    return context.defaultValue;
}

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
