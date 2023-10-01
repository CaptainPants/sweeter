import { allContexts } from './internal/allContexts.js';
import { saveAllContext } from './saveAllContext.js';

export class Context<T> implements Disposable {
    constructor(name: string, current: T) {
        this.name = name;
        this.id = Symbol(name);
        this.current = current;

        allContexts.add(this);
    }

    readonly name: string;

    readonly id: symbol;

    current: T;

    replace(value: T): Disposable {
        const saved = this.current;

        this.current = value;

        return {
            [Symbol.dispose]: () => {
                this.current = saved;
            },
        };
    }

    invoke(value: T, callback: () => void): void {
        using _ = this.replace(value);

        callback();
    }

    /**
     * Intended to use with pattern resume.from(await promise); this will store all current context
     * when .resume is accessed, and restore it when the from method.
     */
    get resume() {
        const saved = saveAllContext();
        return {
            from<T>(result: T): T {
                saved.restore();
                return result;
            },
        };
    }

    [Symbol.dispose](): void {
        allContexts.delete(this);
    }
}
