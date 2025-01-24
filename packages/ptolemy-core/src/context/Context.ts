import { CodeLocation } from '@serpentis/ptolemy-utilities';

import { ExecutionContextVariable } from '../executionContext/ExecutionContextVariable.js';
import { stringifyForDiagnostics } from '../utility/stringifyForDiagnostics.js';

interface ContextNode {
    id: symbol;
    value: unknown;
    type: Context<unknown>;
    parent: ContextNode | undefined;
    codeLocation: CodeLocation;
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

    replace(value: T, codeLocation: CodeLocation): () => void {
        return contextStack.replace({
            id: this.id,
            value: value,
            type: this,
            parent: contextStack.current,
            codeLocation: codeLocation,
        });
    }

    invokeWith<TCallbackResult>(
        value: T,
        codeLocation: CodeLocation,
        callback: () => TCallbackResult,
    ): TCallbackResult {
        return contextStack.invokeWith(
            {
                id: this.id,
                value: value,
                type: this,
                parent: contextStack.current,
                codeLocation: codeLocation,
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
        const result = <T>(context: Context<T>) => {
            return findContext(snapshot, context);
        };
        result.snapshot = snapshot;
        return result;
    }

    private static *walkStack(): IterableIterator<ContextNode> {
        let current = contextStack.current;
        while (current) {
            yield current;
            current = current.parent;
        }
    }

    static debugLogCurrent(): void {
        const map = new Map<symbol, ContextNode>();

        for (const item of Context.walkStack()) {
            if (!map.has(item.id)) {
                map.set(item.id, item);
            }
        }

        console.group('Current contexts');

        for (const [
            _id,
            {
                type: { name },
                codeLocation: [file, func, row, col],
            },
        ] of map) {
            console.log(
                '%c%s:%c %s %s (row: %i, col: %i)',
                'font-weight: bold;',
                name,
                'font-weight: inherit',
                func,
                file,
                row,
                col,
            );
        }

        console.groupEnd();
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

    return res.join('\n');
}
