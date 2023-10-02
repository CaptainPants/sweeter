import { allContexts } from './internal/allContexts.js';
import { saveAllContext } from './saveAllContext.js';

export class Context<T> {
    constructor(name: string, current: T) {
        this.name = name;
        this.id = Symbol(name);
        this.current = current;

        allContexts.add(this);
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

    /**
     * Intended to use with pattern resume.from(await promise); this will store all current context
     * when .resume is accessed, and restore it when the from method.
     */
    static get resume() {
        const saved = saveAllContext();
        return {
            with<T>(result: T): T {
                saved.restore();
                return result;
            },
        };
    }

    dispose(): void {
        allContexts.delete(this);
    }
}
