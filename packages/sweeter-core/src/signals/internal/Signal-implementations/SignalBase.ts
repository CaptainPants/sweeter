import {
    getSignalValueFromState,
    isEqualSignalState,
} from '../../SignalState-support.js';
import { afterCalculationsComplete } from '../../calculationDeferral-reexports.js';
import { announceSignalUsage } from '../../ambient.js';
import { ListenerSet } from '../ListenerSet.js';
import { signalMarker } from '../markers.js';
import {
    type Signal,
    type SignalListener,
    type SignalState,
} from '../../types.js';
import { dev } from '../../../dev.js';
import { getStackTrace } from '@captainpants/sweeter-utilities';

interface ChangeAnnouncerStackNode {
    signal: Signal<unknown>;
    previous: ChangeAnnouncerStackNode | undefined;
}

let develChangeAnnouncerStack: ChangeAnnouncerStackNode | undefined;

export abstract class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;

        if (dev.enabled) {
            this.createdAtStack = getStackTrace();
        }
    }

    #state: SignalState<T>;
    #listeners = new ListenerSet<SignalListener<T>>();

    public readonly [signalMarker] = true;

    public readonly createdAtStack?: string;

    public get value(): T {
        announceSignalUsage(this);
        return this.peek();
    }

    public peek(): T {
        return getSignalValueFromState(this.peekState());
    }

    public peekState(): SignalState<T> {
        this.#ensureInited();
        this._peeking();
        return this.#state;
    }

    public get inited(): boolean {
        return this.#state.mode !== 'INITIALISING';
    }

    /**
     * Should never throw.
     * @param state
     */
    protected _updateAndAnnounce(state: SignalState<T>) {
        const previous = this.#state;

        if (isEqualSignalState(previous, state)) {
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
        // delayed initialisation of a CalculatedSignal
        if (!this.#listeners.any()) {
            return;
        }

        let SignalBase_announceChange = () => {
            this.#listeners.announce(previous, next);
        };

        if (dev.enabled) {
            SignalBase_announceChange = () => {
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
                    this.#listeners.announce(previous, next);
                } finally {
                    reverse();
                    develChangeAnnouncerStack = saved;
                }
            };
        }

        // Don't accidentally subscribe to signals used within listener callbacks, that would be dumb
        // also prevents all kinds of cases that aren't allowed like updating a mutable signal within a recalculation
        afterCalculationsComplete(SignalBase_announceChange);
    }

    public listen(listener: SignalListener<T>, strong = true): () => void {
        this.#ensureInited();

        this.#listeners.add(listener, strong);

        return () => {
            this.unlisten(listener, strong);
        };
    }

    public unlisten(listener: SignalListener<T>, strong = true): void {
        this.#listeners.remove(listener, strong);
    }

    public clearListeners(): void {
        this.#listeners.clear();
    }

    #getPanicContent(): string {
        const res: string[] = [];

        let current = develChangeAnnouncerStack;
        while (current) {
            res.push(current.signal.createdAtStack ?? '');
            current = current.previous;
        }

        return (
            '╚══════════════════╣ Signal dependents took too long to run: ╠══════════════════════╗ \n' +
            res.join(
                '\n═══════════════════════════════════ TRIGGERED BY ═══════════════════════════════════ \n',
            )
        );
    }
}
