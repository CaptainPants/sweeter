import { type SignalState } from './types.js';

export class SignalController<T> {
    #handlers: ((newState: SignalState<T>) => void)[] = [];
    #disconnected = false;

    update(signalState: SignalState<T>): void {
        if (this.#disconnected) return;

        for (const handler of this.#handlers) {
            try {
                handler(signalState);
            } catch (ex) {
                console.error(
                    'Swallowed error in SignalController handlers',
                    ex,
                );
            }
        }
    }

    addUpdateListener(handler: (newState: SignalState<T>) => void): void {
        if (this.#disconnected) return;

        this.#handlers.push(handler);
    }

    disconnect(): void {
        this.#disconnected = true;
        this.#handlers = [];
    }

    get isDisconnected(): boolean {
        return this.#disconnected;
    }
}
