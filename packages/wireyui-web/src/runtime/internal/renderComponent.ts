import {
    type Component,
    type Context,
    type HookFunction,
    type PropsWithIntrinsicAttributesFor,
} from '@captainpants/wireyui-core';
import { addMounted, addUnMounted } from './mounting.js';

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
    let suffix: Comment | undefined;

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

    // do onMount as a suffix, so that child onMounts call first
    init.onMount = (callback: () => void) => {
        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addMounted(createHooks('Mount'), callback);
    };

    // do onUnMount as a prefix, so that child onUnMount are called last
    init.onUnMount = (callback: () => void) => {
        // TODO: this should trigger ErrorBoundary if an exception is thrown
        addUnMounted(createHooks('UnMount'), callback);
    };

    // Not sure if this is really a valuable component in init as you can call Context.current
    // but it does indicate that you should capture the context values you need during init
    // and not later when the context stack is gone
    init.getContext = <T>(context: Context<T>): T => {
        return context.getCurrent();
    };

    // Its reasonably certain that people will trigger side effects when wiring up a component
    // and that these might update signals. We also don't want to accidentally subscribe to these
    // signals -- hence untrack the actual render
    const res = Component(props, init);

    if (!hooks && !suffix) {
        // shortcut if we don't need to add in markers for mount callbacks.
        return res;
    }

    return [hooks, suffix, res];
}
