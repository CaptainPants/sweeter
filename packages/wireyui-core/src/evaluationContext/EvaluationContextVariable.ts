import { allEvaluationContextVariables } from './internal/allEvaluationContextVariables.js';

export class EvaluationContextVariable<T> {
    constructor(name: string, current: T) {
        this.name = name;
        this.id = Symbol(name);
        this.current = current;

        allEvaluationContextVariables.add(this);
    }

    readonly name: string;

    readonly id: symbol;

    current: T;

    replace(value: T): () => void {
        const saved = this.current;

        this.current = value;

        return () => {
            this.current = saved;
        };
    }

    invoke(value: T, callback: () => void): void {
        const restore = this.replace(value);
        try {
            callback();
        } finally {
            restore();
        }
    }

    dispose(): void {
        allEvaluationContextVariables.delete(this);
    }
}
