import {
    subscribeToChanges,
    type HookConstructor,
    type UnsignalAll,
    type ComponentInit,
    type Component,
    type Context,
    type PropsWithIntrinsicAttributesFor,
} from '@captainpants/wireyui-core';
import {
    addMountedCallback,
    addUnMountedCallback,
    removeUnMountedCallback,
} from './mounting.js';

type MightHaveAsyncInitializer = Partial<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Pick<Component<{}, unknown>, 'asyncInitializer'>
>;

export function renderComponent<TComponentType extends Component<unknown>>(
    Component: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
): JSX.Element {
    if ((Component as MightHaveAsyncInitializer).asyncInitializer) {
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

    function createHooks(reason: string) {
        if (hooks) {
            hooks.textContent += `, ${reason}`;
        } else {
            hooks = document.createComment(
                `Hooks(${Component.name}): ${reason}`,
            );
        }
        return hooks;
    }

    init.onMount = (callback: () => (() => void) | void) => {
        if (initCompleted)
            throw new Error('onMount must only be called during init phase.');

        const hooks = createHooks('Mount');

        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addMountedCallback(hooks, () => {
            const unmounted = callback();

            if (typeof unmounted === 'function') {
                const innerUnMounted = () => {
                    removeUnMountedCallback(hooks, innerUnMounted);

                    unmounted();
                };

                addUnMountedCallback(hooks, innerUnMounted);
            }
        });
    };

    init.onUnMount = (callback: () => void) => {
        if (initCompleted)
            throw new Error('onUnMount must only be called during init phase.');

        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addUnMountedCallback(createHooks('UnMount'), callback);
    };

    init.subscribeToChanges = (<TArgs extends readonly unknown[]>(
        dependencies: [...TArgs],
        callback: (args: UnsignalAll<TArgs>) => void | (() => void),
        invokeImmediate = true,
    ) => {
        if (initCompleted)
            throw new Error(
                'subscribeToChanges must only be called during init phase.',
            );

        init.onMount(() => {
            return subscribeToChanges(dependencies, callback, invokeImmediate);
        });
    }) satisfies ComponentInit['subscribeToChanges'];

    // Not sure if this is really a valuable component in init as you can call Context.current
    // but it does indicate that you should capture the context values you need during init
    // and not later when the context stack is gone
    init.getContext = <T>(context: Context<T>): T => {
        if (initCompleted)
            throw new Error(
                'getContext must only be called during init phase.',
            );

        return context.getCurrent();
    };

    const res = Component(props, init, undefined);

    // Makes all init calls throw from now on
    initCompleted = true;

    if (!hooks) {
        // shortcut if we don't need to add in markers for mount callbacks.
        return res;
    }

    return [hooks, res];
}
