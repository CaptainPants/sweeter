import type { Context, Runtime } from './index.js';
import type { UnionToIntersection } from './internal/UnionToIntersection.js';
import type { Signal, UnsignalAll } from './signals/types.js';

export type JSXKey = string | number;

export type JSXElement = JSX.Element;

export type HookConstructor<TArgs extends readonly unknown[], TResult> = new (
    setup: ComponentInit,
    ...args: TArgs
) => TResult;

export type ComponentInitFunction = <TArgs extends readonly unknown[], TResult>(
    hook: HookConstructor<TArgs, TResult>,
    ...args: TArgs
) => TResult;

// There may be extensions to this later, with Setup becoming SetupFunction & { other() => void };
export type ComponentInit = ComponentInitFunction & {
    onMount: (callback: () => (() => void) | void) => void;
    onUnMount: (callback: () => void) => void;
    subscribeToChanges: <TArgs extends readonly unknown[]>(
        // the [...TArgs] causes inference as a tuple more often (although not for literal types)
        dependencies: [...TArgs],
        callback: (values: UnsignalAll<TArgs>) => void | (() => void),
        invokeOnSubscribe?: boolean,
    ) => void;
    getContext: <T>(context: Context<T>) => T;
    nextId(basis?: string): string;
    runtime: Runtime;

    isValid: boolean;
};

export type AsyncInitializerHookConstructor<
    TArgs extends readonly unknown[],
    TResult,
> = new (setup: AsyncInitializerInit, ...args: TArgs) => TResult;

export type AsyncInitializerInitFunction = <
    TArgs extends readonly unknown[],
    TResult,
>(
    hook: AsyncInitializerHookConstructor<TArgs, TResult>,
    ...args: TArgs
) => TResult;

export type AsyncInitializerInit = AsyncInitializerInitFunction & {
    getContext: <T>(context: Context<T>) => T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Component<TProps = {}> = (
    props: TProps,
    init: ComponentInit,
) => JSX.Element;

export type AsyncComponent<TProps, TAsyncInitializationResult> = ((
    props: TProps,
    init: ComponentInit,
    initializerResult: TAsyncInitializationResult,
) => JSX.Element) & {
    asyncInitializer: (
        props: TProps,
        init: AsyncInitializerInit,
        signal: AbortSignal,
    ) => Promise<TAsyncInitializationResult>;
};

export type AnyComponent<TProps> =
    | Component<TProps>
    | AsyncComponent<TProps, unknown>;

export type ComponentOrIntrinsicElementTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any> | AsyncComponent<any, any> | string | undefined;
export type ComponentTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any> | AsyncComponent<any, any>;

export type JSXResultForComponentOrElementType<
    ComponentType extends ComponentOrIntrinsicElementTypeConstraint,
> = ComponentType extends string
    ? SweeterExtensionPoints.IntrinsicElementNameToType<ComponentType>[keyof SweeterExtensionPoints.IntrinsicElementNameToType<ComponentType>]
    : JSXElement;

export type PropsFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> = ComponentOrIntrinsicElementTypeString extends Component<infer Props>
    ? Props
    : // I don't think its possible to have a Component that doesn't implement AsyncComponent but just in case

    ComponentOrIntrinsicElementTypeString extends AsyncComponent<
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          infer AsyncInitializerResult,
          infer Props
      >
    ? Props
    : ComponentOrIntrinsicElementTypeString extends string
    ? IntrinsicElementProps<ComponentOrIntrinsicElementTypeString>
    : never;

export type PropsWithIntrinsicAttributesFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> = PropsFor<ComponentOrIntrinsicElementTypeString> & JSX.IntrinsicAttributes;

export type ChildrenTypeFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> = PropsFor<ComponentOrIntrinsicElementTypeString> extends {
    children: infer Children;
}
    ? Children
    : never;

export type MightBeSignal<T> = T | Signal<T>;

/**
 * Take a props interface and make each property optionally a Signal.
 * You should ensure that the values aren't signals already.
 */
export type PropertiesMightBeSignals<TProps> = {
    [Key in keyof TProps]: Signal<TProps[Key]> | TProps[Key];
};

/**
 * Extended by declaration merging into IntrinsicElementNames and IntrinsicElementAttributeParts.
 */
export type IntrinsicElementAttributes<TElementTypeString extends string> =
    UnionToIntersection<
        SweeterExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>[keyof SweeterExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>]
    >;

/**
 * Extended by declaration merging into RuntimeRootHostElementTypes.
 */
export type IntrinsicElementDoNotSignalifyAttributes<
    TElementTypeString extends string,
> =
    SweeterExtensionPoints.SkipSignalifyingIntrinsicElementAttributes<TElementTypeString>[keyof SweeterExtensionPoints.SkipSignalifyingIntrinsicElementAttributes<TElementTypeString>];

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementProps<TElementTypeString extends string> =
    PropertiesMightBeSignals<
        Omit<
            IntrinsicElementAttributes<TElementTypeString>,
            IntrinsicElementDoNotSignalifyAttributes<TElementTypeString>
        >
    > &
        Pick<
            IntrinsicElementAttributes<TElementTypeString>,
            IntrinsicElementDoNotSignalifyAttributes<TElementTypeString>
        >;

/**
 * Extended by declaration merging into RuntimeRootHostElementTypes.
 */
export type RuntimeRootHostElement =
    SweeterExtensionPoints.RuntimeRootHostElementTypes[keyof SweeterExtensionPoints.RuntimeRootHostElementTypes];

/**
 * Extended by declaration merging into IntrinsicElementTypes.
 */
export type IntrinsicElement =
    SweeterExtensionPoints.IntrinsicElementTypes[keyof SweeterExtensionPoints.IntrinsicElementTypes];
