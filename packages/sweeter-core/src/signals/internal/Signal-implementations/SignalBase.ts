import {
    getSignalValueFromState,
    isEqualSignalState,
} from '../../SignalState-support.js';
import { afterCalculationsComplete } from '../../calculationDeferral-reexports.js';
import { announceSignalUsage } from '../../ambient.js';
import { type ListenerSetDebugItem, ListenerSet } from '../ListenerSet.js';
import { signalMarker } from '../markers.js';
import {
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

export abstract class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;

        if (dev.isEnabled) {
            this.createdAtStack = new StackTrace({ skipFrames: 1 });
        }
    }

    #state: SignalState<T>;
    #listeners = new ListenerSet<T>();

    public readonly [signalMarker] = true;

    public readonly createdAtStack?: StackTrace;

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

        if (dev.isEnabled) {
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

    debugGetListenerTree(): string {
        const resultParts: string[] = [];

        const stack: ListenerTreeNode[] = [];
        // We are doing a depth first, pre-order traversal

        let current: ListenerTreeNode | undefined = {
            padding: '',
            signal: this,
            listener: undefined,
        };
        while (current) {
            if (current.signal) {
                // Cheating the Signal abstraction here a bit, but .. eh..
                const children = (
                    current.signal as SignalBase<unknown>
                ).#listeners
                    .debugGetAllListeners()
                    .reverse();

                for (const child of children) {
                    stack.push({
                        padding: current.padding + '    ',
                        listener: child,
                        signal: child.listener.updateFor,
                    });
                }
            }

            // Process parent
            this.#debugProcessParent(
                current.padding,
                current.listener,
                current.signal,
                resultParts,
            );
            resultParts.push('\n');

            current = stack.pop();
        }

        return resultParts.join('\n\n');
    }

    /**
     * This is basically just convenience in your chrome developer console.
     */
    debugLogListenerTree(): void {
        console.log(this.debugGetListenerTree());
    }

    #debugProcessParent(
        padding: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't use the actual function, we just wants its name and its 'addedStackTrace' if present
        listener: ListenerSetDebugItem<any> | undefined,
        signal: Signal<unknown> | undefined,
        result: string[],
    ): void {
        if (signal) {
            result.push(
                `${padding}== Signal from == \n${
                    signal.createdAtStack?.getNice(padding) ??
                    `${padding}<no stack trace>\n`
                }${padding}====\n`,
            );
        } else if (listener) {
            result.push(
                `${padding}== Listener ${listener.listener.name} from == \n${
                    listener.addedStackTrace?.getNice(padding) ??
                    `${padding}<no stack trace>\n`
                }${padding}====\n`,
            );
        } else {
            // This shouldn't happen right?
            result.push(`${padding}No information on listener.\n`);
        }
    }
}

interface ListenerTreeNode {
    padding: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener?: ListenerSetDebugItem<any> | undefined;
    signal: Signal<unknown> | undefined;
}
