import type {
    Component,
    Context,
    HookFunction,
    PropsWithIntrinsicAttributesFor,
} from '@captainpants/wireyui-core';
import { addMounted, addUnMounted } from '../../internal/mounting.js';

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

    let prefix: Comment | undefined;
    let suffix: Comment | undefined;

    const init = <TArgs extends readonly unknown[], TResult>(
        hook: HookFunction<TArgs, TResult>,
        ...args: TArgs
    ): TResult => {
        return hook(init, ...args);
    };

    // do onMount as a suffix, so that child onMounts call first
    init.onMount = (callback: () => void) => {
        // TODO: this should trigger ErrorBoundary if an exception is thrown
        suffix ??= document.createComment(`onMount(${Component.name})`);
        addMounted(suffix, callback);
    };

    // do onMount as a prefix, so that child onUnMount are called last
    init.onUnMount = (callback: () => void) => {
        // TODO: this should trigger ErrorBoundary if an exception is thrown
        prefix ??= document.createComment(`onUnmount(${Component.name})`);
        addUnMounted(prefix, callback);
    };

    // Not sure if this is really a valuable component in init as you can call Context.current
    // but it does indicate that you should capture the context values you need during init
    // and not later when the context stack is gone
    init.getContext = <T>(context: Context<T>): T => {
        return context.getCurrent();
    };

    const res = Component(props, init);

    if (!prefix && !suffix) {
        return res;
    }

    return [prefix, res, suffix];
}
