import type { Context } from './index.js';
import type { Signal } from './signals/types.js';

export type JSXKey = string | number;

export type JSXElement = JSX.Element;

export type HookFunction<TArgs extends readonly unknown[], TResult> = (
    setup: ComponentInit,
    ...args: TArgs
) => TResult;

export type ComponentInitFunction = <TArgs extends readonly unknown[], TResult>(
    hook: HookFunction<TArgs, TResult>,
    ...args: TArgs
) => TResult;

export type AsyncInitializerInit = {
    getContext: <T>(context: Context<T>) => T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type IfSpecified<T, TData> = [T] extends [never] ? {} : TData;

// There may be extensions to this later, with Setup becoming SetupFunction & { other() => void };
export type ComponentInit<TAsyncInitializationResult = never> =
    ComponentInitFunction & {
        onMount: (callback: () => void) => void;
        onUnMount: (callback: () => void) => void;
        getContext: <T>(context: Context<T>) => T;
    } & IfSpecified<
            TAsyncInitializationResult,
            {
                asyncInitializerResult: TAsyncInitializationResult;
            }
        >;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Component<TProps = {}, TAsyncInitializationResult = never> = ((
    props: Props<TProps>,
    init: ComponentInit<TAsyncInitializationResult>,
) => JSX.Element) &
    IfSpecified<
        TAsyncInitializationResult,
        {
            asyncInitializer: (
                props: Props<TProps>,
                init: AsyncInitializerInit,
            ) => TAsyncInitializationResult;
        }
    >;

export type ComponentOrIntrinsicElementTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any> | string | undefined;

export type IntrinsicElementProps<TElementType extends string> =
    JSX.IntrinsicElementAttributes<TElementType>;

export type PropsFor<
    ComponentOrIntrinsicElementType extends
        ComponentOrIntrinsicElementTypeConstraint,
> = ComponentOrIntrinsicElementType extends Component<infer Props>
    ? Props
    : ComponentOrIntrinsicElementType extends string
    ? IntrinsicElementProps<ComponentOrIntrinsicElementType>
    : never;

export type PropsWithIntrinsicAttributesFor<
    ComponentOrIntrinsicElementType extends
        ComponentOrIntrinsicElementTypeConstraint,
> = PropsFor<ComponentOrIntrinsicElementType> & JSX.IntrinsicAttributes;

export type ChildrenTypeFor<
    ComponentOrIntrinsicElementType extends
        ComponentOrIntrinsicElementTypeConstraint,
> = PropsFor<ComponentOrIntrinsicElementType> extends {
    children: infer Children;
}
    ? Children
    : never;

/**
 * Take a props interface and make each property optionally a Signal.
 */
export type Props<TProps> = {
    [Key in keyof TProps]: Signal<TProps[Key]> | TProps[Key];
};
