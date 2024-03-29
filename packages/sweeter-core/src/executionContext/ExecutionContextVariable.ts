import { allExecutionContextVariables } from './internal/allExecutionContextVariables.js';

export class ExecutionContextVariable<T> {
    constructor(name: string, current: T) {
        this.name = name;
        this.id = Symbol(name);
        this.current = current;

        allExecutionContextVariables.add(this);
    }

    readonly name: string;

    readonly id: symbol;

    current: T;

    replace(value: T): () => void {
        const saved = this.current;

        this.current = value;

        const ExecutionContextVariable_replace_revert = () => {
            this.current = saved;
        };

        return ExecutionContextVariable_replace_revert;
    }

    invokeWith<TCallbackResult>(
        value: T,
        callback: () => TCallbackResult,
    ): TCallbackResult {
        const restore = this.replace(value);
        try {
            return callback();
        } finally {
            restore();
        }
    }

    dispose(): void {
        allExecutionContextVariables.delete(this);
    }
}
