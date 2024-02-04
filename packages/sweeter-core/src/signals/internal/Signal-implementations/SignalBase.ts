import {
    getSignalValueFromState,
    isEqualSignalState,
} from '../../SignalState-support.js';
import { announceSignalUsage } from '../../ambient.js';
import { ListenerSet } from '../ListenerSet.js';
import { signalMarker } from '../markers.js';
import {
    type DebugDependencyNode,
    type Signal,
    type SignalListener,
    type SignalState,
} from '../../types.js';
import { dev } from '../../../dev.js';
import { StackTrace } from '@captainpants/sweeter-utilities';

interface ChangeAnnouncerStackNode {
    signal: Signal<unknown>;
    previous: ChangeAnnouncerStackNode | undefined;
}

let develChangeAnnouncerStack: ChangeAnnouncerStackNode | undefined;
let signalCounter = 0;

export abstract class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;

        if (dev.flag('signalStacks')) {
            this.createdAtStack = new StackTrace({ skipFrames: 1 });
        }
    }

    #state: SignalState<T>;
    #listeners = new ListenerSet<T>();

    public readonly [signalMarker] = true;

    public readonly id: number = ++signalCounter;

    public readonly createdAtStack?: StackTrace;

    public get value(): T {
        announceSignalUsage(this);
        return this.peek();
    }

    public peek(): T {
        return getSignalValueFromState(this.peekState());
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

        if (dev.isEnabled) {
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
            return;
        }

        // Don't accidentally subscribe to signals used within listener callbacks, that would be dumb
        // also prevents all kinds of cases that aren't allowed like updating a mutable signal within a recalculation
        this.#listeners.announce(previous, next);
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

    debugGetListenerTree(): DebugDependencyNode {
        const truncateStackTraces = 30;

        const dependents = this.#listeners
            .debugGetAllListeners()
            .map((child) => {
                // If its a signal:
                if (child.listener.debugListenerForSignal) {
                    return child.listener.debugListenerForSignal.debugGetListenerTree();
                }

                // Otherwise its just a function, and all we can do is capture the stack trace from
                // when it was added (and its name).
                return {
                    type: 'listener',
                    addedAtStack: child.addedStackTrace
                        ?.getNice({ truncate: truncateStackTraces })
                        .split('\n'),
                } as DebugDependencyNode;
            });

        return {
            type: 'signal',
            signalId: this.id,
            state: this.peekState(false),
            signalCreatedAtStack: this.createdAtStack
                ?.getNice({ truncate: truncateStackTraces })
                .split('\n'),
            dependents,
        };
    }

    /**
     * This is basically just convenience in your chrome developer console.
     */
    debugLogListenerTree(): void {
        console.log(this.debugGetListenerTree());
    }
}
