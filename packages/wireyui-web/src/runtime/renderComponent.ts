import type {
    Component,
    Context,
    HookFunction,
    PropsWithIntrinsicAttributesFor,
} from '@captainpants/wireyui-core';
import { addMounted, addUnMounted } from '../internal/mounting.js';

export function renderComponent<TComponentType extends Component<unknown>>(
    Component: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
): JSX.Element {
    const prefix = document.createComment(`onMount(${Component.name})`);
    const suffix = document.createComment(`onUnmount(${Component.name})`);

    const init = <TArgs extends readonly unknown[], TResult>(
        hook: HookFunction<TArgs, TResult>,
        ...args: TArgs
    ): TResult => {
        return hook(init, ...args);
    };
    init.onMount = (callback: () => void) => {
        addMounted(prefix, callback);
    };
    init.onUnMount = (callback: () => void) => {
        addUnMounted(suffix, callback);
    };
    init.getContext = <T>(context: Context<T>): T => {
        return context.current;
    };

    const res = Component(props, init);

    return [prefix, res, suffix];
}
