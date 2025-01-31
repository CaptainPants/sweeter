import { dev } from '../../../dev.js';
import { announceSignalUsage } from '../../ambient.js';
import { SignalState } from '../../SignalState.js';
import {
    DebugListenerInfo,
    type Signal,
    type SignalListener,
} from '../../types.js';
import { SignalChangeListenerSet } from '../SignalChangeListenerSet.js';

import { debugStackTracesFlag, SignalBase } from './SignalBase.js';

interface ChangeAnnouncerStackNode {
    signal: Signal<unknown>;
    previous: ChangeAnnouncerStackNode | undefined;
}

let develChangeAnnouncerStack: ChangeAnnouncerStackNode | undefined;

export abstract class NormalSignalBase<T> extends SignalBase<T> {
    constructor(state: SignalState<T>) {
        super();
        this.#state = state;
    }

    #state: SignalState<T>;
    #listeners = new SignalChangeListenerSet<T>();

    public get value(): T {
        announceSignalUsage(this);
        return this.peek();
    }

    public peek(): T {
        return SignalState.getValue(this.peekState());
    }

    public peekState(ensureInit = true): SignalState<T> {
        if (ensureInit) {
            this.#ensureInited();
        }
        this._peeking();
        if (ensureInit && this.#state.mode === 'INITIALISING') {
            throw new TypeError('Expected signal to be initialized.');
        }
        return this.#state;
    }

    public get inited(): boolean {
        return this.#state.mode !== 'INITIALISING';
    }

    public get failed(): boolean {
        return this.#state.mode === 'ERROR';
    }

    /**
     * Should never throw.
     * @param state
     */
    protected _updateAndAnnounce(state: SignalState<T>) {
        const previous = this.#state;

        if (SignalState.isEqual(previous, state)) {
            return; // Don't announce the change if the values were equal
        }

        // Prevent accidental mutation of internal state by caller
        Object.freeze(state);
        this.#state = state;

        this.#announceChange(previous, state);
    }

    #ensureInited(): void {
        if (this.#state.mode === 'INITIALISING') {
            this._init();
        }
    }

    protected _init(): void {
        throw new TypeError(
            '_init not implemented, so the signal must be initialized at construction.',
        );
    }

    protected _peeking(): void {
        // If its a calculated signal that has been marked as dirty, this will be called at the end of the current batch
    }

    #announceChange(previous: SignalState<T>, next: SignalState<T>) {
        // It is reasonably common that there might not be any listeners yet, e.g. during
        // delayed initialisation of a DerivedSignal
        if (!this.#listeners.any()) {
            return;
        }

        if (dev.flag(debugStackTracesFlag)) {
            const saved = develChangeAnnouncerStack;
            develChangeAnnouncerStack = {
                signal: this,
                previous: develChangeAnnouncerStack,
            };

            const reverse = dev.monitorOperation(
                'Signal change announcement',
                1000,
                () => this.#getPanicContent(),
            );
            try {
                this.#listeners.announce(next, previous, this);
            } finally {
                reverse();
                develChangeAnnouncerStack = saved;
            }
            return;
        }

        // Don't accidentally subscribe to signals used within listener callbacks, that would be dumb
        // also prevents all kinds of cases that aren't allowed like updating a mutable signal within a recalculation
        this.#listeners.announce(next, previous, this);
    }

    public listen(listener: SignalListener<T>): () => void {
        this.#ensureInited();

        this.#listeners.add(listener, true);

        return () => {
            this.unlisten(listener);
        };
    }

    public listenWeak(listener: SignalListener<T>): () => void {
        this.#ensureInited();

        this.#listeners.add(listener, false);

        return () => {
            this.unlistenWeak(listener);
        };
    }

    public unlisten(listener: SignalListener<T>): void {
        this.#listeners.remove(listener, true);
    }

    public unlistenWeak(listener: SignalListener<T>): void {
        this.#listeners.remove(listener, false);
    }

    public clearListeners(): void {
        this.#listeners.clear();
    }

    #getPanicContent(): string {
        const res: string[] = [];

        let current = develChangeAnnouncerStack;
        while (current) {
            res.push(
                current.signal.createdAtStack?.getNice() ?? '<not captured>',
            );
            current = current.previous;
        }

        return (
            '╚══════════════════╣ Signal dependents took too long to run: ╠══════════════════════╗ \n' +
            res.join(
                '\n═══════════════════════════════════ TRIGGERED BY ═══════════════════════════════════ \n',
            )
        );
    }
    
    public override getDebugListenerInfo(): DebugListenerInfo {
        return {
            liveCount: this.#listeners.getLiveCount(),
            getDetail: () => this.#listeners.getDebugDetail(),
        };
    }
}
