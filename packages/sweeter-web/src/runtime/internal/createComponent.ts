import {
    subscribeToChanges,
    type HookConstructor,
    type UnsignalAll,
    type ComponentInit,
    type Component,
    Context,
    type PropsWithIntrinsicAttributesFor,
    ErrorBoundaryContext,
} from '@captainpants/sweeter-core';
import {
    addMountedCallback,
    addUnMountedCallback,
    removeUnMountedCallback,
} from './mounting.js';
import { type WebRuntime } from '../WebRuntime.js';

type UnknownComponent = {
    (
        props: unknown,
        init: ComponentInit,
        asyncInitializerResult: unknown,
    ): JSX.Element;
    asyncInitializer?: (props: unknown, init: ComponentInit) => unknown;
};

export function createComponent<TComponentType extends Component<unknown>>(
    Component: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
    webRuntime: WebRuntime,
): JSX.Element {
    // Use this to get the error context within callbacks
    const getContextFromSnapshot = Context.createSnapshot();

    const ComponentUnTyped = Component as unknown as UnknownComponent;

    if (ComponentUnTyped.asyncInitializer) {
        // TODO: if asyncInitializer is specified, we wrap the component in an Async
    }

    let hooks: Comment | undefined;
    let initCompleted = false;

    const init = <TArgs extends readonly unknown[], TResult>(
        Hook: HookConstructor<TArgs, TResult>,
        ...args: TArgs
    ): TResult => {
        return new Hook(init, ...args);
    };

    function createOrGetMagicComment(reason: string) {
        if (hooks) {
            hooks.textContent += `, ${reason}`;
        } else {
            hooks = document.createComment(
                `Hooks(${Component.name}): ${reason}`,
            );
        }
        return hooks;
    }

    function callAgainstErrorBoundary<T>(callback: () => T, fallback: T): T {
        try {
            return callback();
        } catch (ex) {
            getContextFromSnapshot(ErrorBoundaryContext).error(ex);
            return fallback;
        }
    }

    init.onMount = (callback: () => (() => void) | void) => {
        if (initCompleted) {
            throw new Error('onMount must only be called during init phase.');
        }

        const hooks = createOrGetMagicComment('Mount');

        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addMountedCallback(hooks, () => {
            const unmounted = callAgainstErrorBoundary(callback, void 0);

            if (typeof unmounted === 'function') {
                const innerUnMounted = () => {
                    removeUnMountedCallback(hooks, innerUnMounted);

                    callAgainstErrorBoundary(unmounted, void 0);
                };

                addUnMountedCallback(hooks, innerUnMounted);
            }
        });
    };

    init.onUnMount = (callback: () => void) => {
        if (initCompleted) {
            throw new Error('onUnMount must only be called during init phase.');
        }

        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addUnMountedCallback(createOrGetMagicComment('UnMount'), () => {
            callAgainstErrorBoundary(callback, void 0);
        });
    };

    init.subscribeToChanges = <TArgs extends readonly unknown[]>(
        dependencies: [...TArgs],
        callback: (args: UnsignalAll<TArgs>) => void | (() => void),
        invokeImmediate = true,
    ) => {
        if (initCompleted) {
            throw new Error(
                'subscribeToChanges must only be called during init phase.',
            );
        }

        init.onMount(() => {
            return subscribeToChanges(dependencies, callback, invokeImmediate);
        });
    };

    init.runtime = webRuntime;

    // Not sure if this is really a valuable component in init as you can call Context.current
    // but it does indicate that you should capture the context values you need during init
    // and not later when the context stack is gone
    init.getContext = <T>(context: Context<T>): T => {
        if (initCompleted) {
            throw new Error(
                'getContext must only be called during init phase.',
            );
        }

        return context.getCurrent();
    };

    const res = ComponentUnTyped(props, init, undefined);

    // Makes all init calls throw from now on
    initCompleted = true;

    if (!hooks) {
        // shortcut if we don't need to add in markers for mount callbacks.
        return res;
    }

    return [hooks, res];
}
