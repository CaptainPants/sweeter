import {
    $controller,
    $insertLocation,
    ComponentFaultContext,
    type ComponentInit,
    type ComponentTypeConstraint,
    Context,
    type IdGenerator,
    initializeHook,
    mapProps,
    type PropsInputFor,
    type PropsParamForComponent,
    type Signal,
    SignalState,
    subscribeToChanges,
    type UnsignalAll,
    untrack,
} from '@serpentis/ptolemy-core';
import { whenGarbageCollected } from '@serpentis/ptolemy-utilities';

import { type WebRuntime } from '../types.js';

import { addMountedCallback, addUnMountedCallback } from './mounting.js';

const hookInitSymbol = Symbol('hook');

type ExtendedComponentInit = ComponentInit & {
    [hookInitSymbol]: Comment | undefined;
};

function createComponentInstanceInit<
    TComponentType extends ComponentTypeConstraint,
>(Component: TComponentType, webRuntime: WebRuntime): ExtendedComponentInit {
    // Use this to get the error context within callbacks
    const getContext = Context.createSnapshot();

    function getOrCreateMagicComment(reason: string): Comment {
        let hooks = init[hookInitSymbol];

        if (hooks) {
            hooks.textContent += `, ${reason}`;
        } else {
            hooks = init[hookInitSymbol] = document.createComment(
                `Hooks(${Component.name}): ${reason}`,
            );
        }
        return hooks;
    }

    let idGenerator: IdGenerator | undefined;

    const init: ExtendedComponentInit = {
        isValid: true,
        [hookInitSymbol]: undefined,

        hook(hook, ...args) {
            if (!init.isValid) {
                throw new Error(
                    'hook init must only be called during init phase.',
                );
            }

            return initializeHook(init, hook, ...args);
        },
        onMount(callback: () => (() => void) | void) {
            if (!init.isValid) {
                throw new Error(
                    'onMount must only be called during init phase.',
                );
            }

            const hooks = getOrCreateMagicComment('onMount');

            addMountedCallback(getContext, hooks, callback);
        },
        onUnMount(callback: () => void) {
            if (!init.isValid) {
                throw new Error(
                    'onUnMount must only be called during init phase.',
                );
            }

            addUnMountedCallback(
                getContext,
                getOrCreateMagicComment('onUnMount'),
                callback,
            );
        },
        trackSignals<TArgs extends readonly unknown[]>(
            dependencies: [...TArgs],
            callback: (args: UnsignalAll<TArgs>) => void | (() => void),
        ) {
            if (!init.isValid) {
                throw new Error(
                    'trackSignals must only be called during init phase.',
                );
            }

            addMountedCallback(
                getContext,
                getOrCreateMagicComment('trackSignals'),
                function subscribeChanges_onMount() {
                    return subscribeToChanges(
                        dependencies,
                        callback,
                        // invoke immediately
                        true,
                    );
                },
            );
        },
        onSignalChange<TArgs extends readonly unknown[]>(
            dependencies: [...TArgs],
            callback: (args: UnsignalAll<TArgs>) => void,
            invokeImmediately: boolean | undefined,
        ) {
            if (!init.isValid) {
                throw new Error(
                    'onSignalChange must only be called during init phase.',
                );
            }

            const cleanup = untrack(() => {
                return subscribeToChanges(
                    dependencies,
                    callback,
                    invokeImmediately,
                    // Weakly subscribe -- lifetime managed by magic comment
                    false,
                );
            });

            whenGarbageCollected(
                // When this magic comment gets removed,
                // clean up.
                getOrCreateMagicComment('onSignalChange'),
                cleanup,
            );

            return cleanup;
        },
        get idGenerator(): IdGenerator {
            if (!init.isValid) {
                throw new Error(
                    'idGenerator must only be called during init phase. You can store the result for later use.',
                );
            }

            return (idGenerator ??= {
                next: (basis?: string) => {
                    return webRuntime.nextId(basis);
                },
            });
        },

        // Not sure if this is really a valuable component in init as you can call Context.current
        // but it does indicate that you should capture the context values you need during init
        // and not later when the context stack is gone
        getContext<T>(context: Context<T>): T {
            if (!init.isValid) {
                throw new Error(
                    'getContext must only be called during init phase.',
                );
            }

            return context.getCurrent();
        },

        runtime: webRuntime,
    };

    return init;
}

export function createComponentInstance<
    TComponentType extends ComponentTypeConstraint,
>(
    Component: TComponentType,
    props: PropsInputFor<TComponentType>,
    webRuntime: WebRuntime,
): Signal<JSX.Element> {
    const resultController = $controller<JSX.Element>();

    const result = ComponentFaultContext.invokeWith(
        {
            reportFaulted(err) {
                // This might be undefined
                console.log('Faulted (createComponentInstance): ', result);
                resultController.updateState(SignalState.error(err));
            },
        },
        $insertLocation(),
        () => {
            const init = createComponentInstanceInit(Component, webRuntime);

            // The typing on propMappings here is a bit dodgy
            const propsParam = mapProps(
                Component.propMappings,
                props,
            ) as unknown as PropsParamForComponent<TComponentType>; // This is a cheat, it caters to the fictional properties on the parameter for custom conversions

            const componentContent = Component(propsParam, init);

            // Makes all init calls throw from now on
            init.isValid = false;

            const hookElement = init[hookInitSymbol];

            // If it failed, we don't want to overwrite the failure state
            if (!resultController.signal.failed) {
                // shortcut if we don't need to add in markers for mount callbacks.
                if (hookElement) {
                    resultController.updateState(
                        SignalState.success([componentContent, hookElement]),
                    );
                } else {
                    // shortcut if we don't need to add in markers for mount callbacks.
                    resultController.updateState(
                        SignalState.success(componentContent),
                    );
                }
            }

            return resultController.signal;
        },
    );

    return result;
}
