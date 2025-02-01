import { StackTrace } from '@serpentis/ptolemy-utilities';

import { dev } from '../../../dev.js';
import { SignalState } from '../../SignalState.js';
import {
    type DebugDependencyNode,
    DebugListenerInfo,
    type Signal,
    type SignalListener,
} from '../../types.js';
import { PTOLEMY_IS_SIGNAL } from '../markers.js';
import { SignalChangeListenerSet } from '../SignalChangeListenerSet.js';

import { nextId } from './nextId.js';

export const debugStackTracesFlag = 'signal.debugStackTraces';

export abstract class SignalBase<T> implements Signal<T> {
    constructor() {
        if (dev.flag(debugStackTracesFlag)) {
            this.createdAtStack = new StackTrace({ skipFrames: 1 });
        }
    }

    #listeners = new SignalChangeListenerSet<T>();

    public get [PTOLEMY_IS_SIGNAL]() {
        return true as const;
    }

    public readonly id: number = nextId();

    public name?: string | undefined;
    public sourceFile?: string | undefined;
    public sourceMethod?: string | undefined;
    public sourceRow?: number | undefined;
    public sourceCol?: number | undefined;
    public readonly createdAtStack?: StackTrace;

    public abstract get value(): T;

    public abstract peek(): T;

    public abstract peekState(ensureInit?: boolean): SignalState<T>;

    public abstract get inited(): boolean;

    public abstract get failed(): boolean;

    public abstract listen(listener: SignalListener<T>): () => void;

    public abstract listenWeak(listener: SignalListener<T>): () => void;

    public abstract unlisten(listener: SignalListener<T>): void;

    public abstract unlistenWeak(listener: SignalListener<T>): void;

    public abstract clearListeners(): void;

    public debugGetListenerTree(): DebugDependencyNode {
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
                    addedAtStack: child.addedStackTrace,
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
    public debugLogListenerTree(): void {
        const writeToConsole = (node: DebugDependencyNode) => {
            if (node.type === 'signal') {
                console.group(`Signal ${node.signal.getDebugIdentity()}`);

                for (const item of node.dependents) {
                    writeToConsole(item);
                }

                console.groupEnd();
            } else {
                const [file, func, row, col] =
                    node.addedAtStack?.getFirstLocation() ?? [];

                console.log(
                    'Listener: %s %s (row: %i, col: %i)',
                    func,
                    file,
                    row,
                    col,
                );
            }
        };

        const node = this.debugGetListenerTree();

        writeToConsole(node);
    }

    public identify(
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

    public doNotIdentify(): this {
        return this;
    }

    public getDebugIdentity() {
        return `[${this.name}: ${this.sourceMethod}, ${this.sourceFile} at ${this.sourceRow}:${this.sourceCol}]`;
    }

    public abstract getDebugListenerInfo(): DebugListenerInfo;
}
