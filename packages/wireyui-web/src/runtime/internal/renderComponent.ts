import {
    subscribeToChanges,
    type ComponentInit,
    type Component,
    type Context,
    type HookFunction,
    type PropsWithIntrinsicAttributesFor,
} from '@captainpants/wireyui-core';
import { addMounted, addUnMounted, removeUnMounted } from './mounting.js';

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

    const init = <TArgs extends readonly unknown[], TResult>(
        hook: HookFunction<TArgs, TResult>,
        ...args: TArgs
    ): TResult => {
        return hook(init, ...args);
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
        const hooks = createHooks('Mount');

        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addMounted(hooks, () => {
            const unmounted = callback();

            if (typeof unmounted === 'function') {
                const innerUnMounted = () => {
                    removeUnMounted(hooks, innerUnMounted);

                    unmounted();
                };

                addUnMounted(hooks, innerUnMounted);
            }
        });
    };

    init.onUnMount = (callback: () => void) => {
        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addUnMounted(createHooks('UnMount'), callback);
    };

    init.subscribeToChanges = ((
        dependencies: readonly unknown[],
        callback: () => void,
    ) => {
        init.onMount(() => {
            return subscribeToChanges(dependencies, callback);
        });
    }) satisfies ComponentInit['subscribeToChanges'];

    // Not sure if this is really a valuable component in init as you can call Context.current
    // but it does indicate that you should capture the context values you need during init
    // and not later when the context stack is gone
    init.getContext = <T>(context: Context<T>): T => {
        return context.getCurrent();
    };

    const res = Component(props, init, undefined);

    if (!hooks) {
        // shortcut if we don't need to add in markers for mount callbacks.
        return res;
    }

    return [hooks, res];
}
