import {
    subscribeToChanges,
    Context,
    ErrorBoundaryContext,
    Async,
} from '@captainpants/sweeter-core';
import {
    type ComponentTypeConstraint,
    type HookConstructor,
    type UnsignalAll,
    type ComponentInit,
    type PropsWithIntrinsicAttributesFor,
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
    asyncInitializer?: (
        props: unknown,
        init: ComponentInit,
        signal: AbortSignal,
    ) => Promise<unknown>;
};

export function createComponent<TComponentType extends ComponentTypeConstraint>(
    Component: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
    webRuntime: WebRuntime,
    initializerComplete: boolean = false,
    initializerResult: unknown = undefined,
): JSX.Element {
    // Use this to get the error context within callbacks
    const getContextFromSnapshot = Context.createSnapshot();

    const ComponentUnTyped = Component as unknown as UnknownComponent;

    // Special case for asyncInitializer
    if (!initializerComplete && ComponentUnTyped.asyncInitializer) {
        const initializer = ComponentUnTyped.asyncInitializer;

        return createComponent(
            Async<unknown>,
            {
                loadData: (signal) => {
                    return initializer(props, init, signal);
                },
                children: (result) => {
                    return createComponent(
                        Component,
                        props,
                        webRuntime,
                        true,
                        result,
                    );
                },
            },
            webRuntime,
        );
    }

    let hooks: Comment | undefined;
    let initCompleted = false;

    const init = <TArgs extends readonly unknown[], TResult>(
        Hook: HookConstructor<TArgs, TResult>,
        ...args: TArgs
    ): TResult => {
        return new Hook(init, ...args);
    };

    function getOrCreateMagicComment(reason: string) {
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

        const hooks = getOrCreateMagicComment('Mount');

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

        addUnMountedCallback(getOrCreateMagicComment('UnMount'), () => {
            callAgainstErrorBoundary(callback, void 0);
        });
    };

    init.subscribeToChanges = <TArgs extends readonly unknown[]>(
        dependencies: [...TArgs],
        callback: (args: UnsignalAll<TArgs>) => void | (() => void),
        invokeOnSubscribe = true,
    ) => {
        if (initCompleted) {
            throw new Error(
                'subscribeToChanges must only be called during init phase.',
            );
        }

        init.onMount(() => {
            return subscribeToChanges(
                dependencies,
                callback,
                invokeOnSubscribe,
            );
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

    const res = ComponentUnTyped(props, init, initializerResult);

    // Makes all init calls throw from now on
    initCompleted = true;

    if (!hooks) {
        // shortcut if we don't need to add in markers for mount callbacks.
        return res;
    }

    return [hooks, res];
}
