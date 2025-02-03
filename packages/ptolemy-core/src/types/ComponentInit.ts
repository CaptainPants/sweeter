import { type Context } from "../context/Context.js";
import { type Runtime } from "../runtime/Runtime.js";
import { type UnsignalAll } from "../signals/types.js";

import { type HookInitializer } from "./hooks.js";
import { type IdGenerator } from "./misc.js";


/**
 * Object passed to Component functions for initialization. Gives access to mount/unMount callbacks, as well as subscribeToChanges for subscribing to signals with automatic cleanup.
 */
export interface ComponentInit {
    hook<TArgs extends readonly unknown[], TResult>(
        hookClassOrFactory: HookInitializer<TArgs, TResult>,
        ...args: TArgs
    ): TResult;

    onMount(callback: () => (() => void) | void): void;
    onUnMount(callback: () => void): void;
    /**
     * Subscribe to signals while mounted, with optional cleanup functions called before the next callback / unmount.
     *
     * The callback is invoked on mount with the current value of the signals.
     *
     * The subscription is removed and cleanup function called  while unmounted.
     *
     * @param dependencies Subscribe to each of these dependencies
     * @param callback Call this method any time one of the dependencies changes
     */
    trackSignals<TArgs extends readonly unknown[]>(
        // the [...TArgs] causes inference as a tuple more often (although not for literal types)
        dependencies: [...TArgs],
        callback: (values: UnsignalAll<TArgs>) => void | (() => void),
    ): void;
    /**
     * Subscribe to signals.
     * @param dependencies Subscribe to each of these dependencies
     * @param callback Call this method any time one of the dependencies changes
     * @param invokeImmediately (Default to true) invokes the callback immediately if true
     */
    onSignalChange<TArgs extends readonly unknown[]>(
        // the [...TArgs] causes inference as a tuple more often (although not for literal types)
        dependencies: [...TArgs],
        callback: (values: UnsignalAll<TArgs>) => void,
        invokeImmediately?: boolean,
    ): () => void;
    getContext<T>(context: Context<T>): T;

    readonly idGenerator: IdGenerator;

    readonly runtime: Runtime;

    /**
     * This is true while the Init object is valid to use, I.e. during initialization. It is then set to false, and all methods will throw when used.
     */
    isValid: boolean;
}