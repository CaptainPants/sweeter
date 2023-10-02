import { EvaluationContextVariable } from '../evaluationContext/EvaluationContextVariable.js';

interface ContextNode {
    id: symbol;
    value: unknown;
    parent: ContextNode | undefined;
}

const stack = new EvaluationContextVariable<ContextNode | undefined>(
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
        return stack.replace({
            id: this.id,
            value: value,
            parent: stack.current,
        });
    }

    invoke(value: T, callback: () => void): void {
        return stack.invoke(
            {
                id: this.id,
                value: value,
                parent: stack.current,
            },
            callback,
        );
    }

    getCurrent(): T {
        const current = stack.current;
        while (current) {
            if (current.id === this.id) {
                return current.value as T;
            }
        }
        return this.defaultValue;
    }
}
