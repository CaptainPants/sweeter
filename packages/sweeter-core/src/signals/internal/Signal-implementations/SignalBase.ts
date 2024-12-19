import { StackTrace } from '@captainpants/sweeter-utilities';

import { announceSignalUsage } from '../../ambient.js';
import { ListenerSet } from '../ListenerSet.js';
import { signalMarker } from '../markers.js';
import {
    type DebugDependencyNode,
    type Signal,
    type SignalListener,
} from '../../types.js';
import { dev } from '../../../dev.js';
import { SignalState } from '../../SignalState.js';

interface ChangeAnnouncerStackNode {
    signal: Signal<unknown>;
    previous: ChangeAnnouncerStackNode | undefined;
}

let develChangeAnnouncerStack: ChangeAnnouncerStackNode | undefined;
let signalCounter = 0;

export abstract class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;

        if (dev.flag('signal.debugStackTraces')) {
            this.createdAtStack = new StackTrace({ skipFrames: 1 });
        }
    }

    #state: SignalState<T>;
    #listeners = new ListenerSet<T>();

    public get [signalMarker]() {
        return true as const;
    }

    public readonly id: number = ++signalCounter;

    public name?: string | undefined;
    public sourceFile?: string | undefined;
    public sourceMethod?: string | undefined;
    public sourceRow?: number | undefined;
    public sourceCol?: number | undefined;
    public readonly createdAtStack?: StackTrace;

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

    debugGetListenerTree(): DebugDependencyNode {
        const truncateStackTraces = 30;

        const dependents = this.#listeners
            .debugGetAllListeners()
            .map((child): DebugDependencyNode => {
                // If its a signal:
                if (child.listener.debugListenerForSignal) {
                    return child.listener.debugListenerForSignal.debugGetListenerTree();
                }

                // Otherwise its just a function, and all we can do is capture the stack trace from
                // when it was added (and its name).
                return {
                    type: 'listener',
                    listener: child.listener,
                    addedAtStack: child.addedStackTrace
                        ?.getNice({ truncate: truncateStackTraces })
                        .split('\n'),
                };
            });

        return {
            type: 'signal',
            signal: this,
            dependents,
        };
    }

    /**
     * This is basically just convenience in your chrome developer console.
     */
    debugLogListenerTree(): void {
        const writeToConsole = (node: DebugDependencyNode) => {
            if (node.type === 'signal') {
                console.group(`Signal ${node.signal.getDebugIdentity()}`);

                for (const item of node.dependents) {
                    writeToConsole(item);
                }

                console.groupEnd();
            } else {
                // TODO:
                console.log('Listener');
            }
        };

        const node = this.debugGetListenerTree();

        writeToConsole(node);
    }

    identify(
        name: string,
        sourceFile?: string,
        sourceMethod?: string,
        row?: number,
        col?: number,
    ): this {
        this.name = name;
        this.sourceFile = sourceFile;
        this.sourceMethod = sourceMethod;
        this.sourceRow = row;
        this.sourceCol = col;
        return this;
    }

    getDebugIdentity() {
        return `[${this.name}: ${this.sourceMethod}, ${this.sourceFile} at ${this.sourceRow}:${this.sourceCol}]`;
    }
}
