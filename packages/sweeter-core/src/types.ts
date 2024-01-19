import { type Context, type Runtime } from './index.js';
import { type UnionToIntersection } from './internal/UnionToIntersection.js';
import { type Signal, type UnsignalAll } from './signals/types.js';

export type JSXKey = string | number;

export type JSXElement = IntrinsicElement | Signal<JSXElement> | JSXElement[];

export type JSXIntrinsicElements = {
    [Key in SweeterExtensionPoints.IntrinsicElementNames[keyof SweeterExtensionPoints.IntrinsicElementNames] &
        string]: IntrinsicElementProps<Key>;
};

export interface JSXIntrinsicAttributes {
    readonly key?: JSXKey | undefined;
}

export type HookFactory<TArgs extends readonly unknown[], TResult> = (
    setup: ComponentInit,
    ...args: TArgs
) => TResult;
export type HookConstructor<TArgs extends readonly unknown[], TResult> = new (
    setup: ComponentInit,
    ...args: TArgs
) => TResult;

export type HookInitializer<TArgs extends readonly unknown[], TResult> =
    | HookFactory<TArgs, TResult>
    | HookConstructor<TArgs, TResult>;

/**
 * Object passed to Component functions for initialization. Gives access to mount/unmo0unt callbacks, as well as subscribeToChanges for subscribing to signals with automatic cleanup.
 */
export interface ComponentInit {
    hook<TArgs extends readonly unknown[], TResult>(
        hookClassOrFactory: HookInitializer<TArgs, TResult>,
        ...args: TArgs
    ): TResult;

    onMount(callback: () => (() => void) | void): void;
    onUnMount(callback: () => void): void;
    /**
     * Subscribe to signals while mounted, with optional cleanup functions called before the next callback / unmount. The subscription is cancelled while unmounted.
     * @param dependencies Subscribe to each of these dependencies
     * @param callback Call this method any time one of the dependencies changes
     * @param invokeOnSubscribe (Default to true) invokes the callback immediately if true
     */
    trackSignals<TArgs extends readonly unknown[]>(
        // the [...TArgs] causes inference as a tuple more often (although not for literal types)
        dependencies: [...TArgs],
        callback: (values: UnsignalAll<TArgs>) => void | (() => void),
    ): void;
    /**
     * Subscribe to signals.
     * @param dependencies Subscribe to each of these dependencies
     * @param callback Call this method any time one of the dependencies changes
     * @param invokeImmediately (Default to true) invokes the callback immediately if true
     */
    onSignalChange<TArgs extends readonly unknown[]>(
        // the [...TArgs] causes inference as a tuple more often (although not for literal types)
        dependencies: [...TArgs],
        callback: (values: UnsignalAll<TArgs>) => void,
        invokeImmediately?: boolean,
    ): void;
    getContext<T>(context: Context<T>): T;
    nextId(basis?: string): string;

    readonly runtime: Runtime;

    /**
     * This is true while the Init object is valid to use, I.e. during initialization. It is then set to false, and all methods will throw when used.
     */
    isValid: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NoProps = {};

export type Component<TProps = NoProps> = (
    props: TProps,
    init: ComponentInit,
) => JSX.Element;

export type ComponentOrIntrinsicElementTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any> | string;
export type ComponentTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any>;

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
    JSXIntrinsicAttributes &
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
            IntrinsicElementDoNotSignalifyAttributes<TElementTypeString> &
                keyof IntrinsicElementAttributes<TElementTypeString>
        >
    > &
        Pick<
            IntrinsicElementAttributes<TElementTypeString>,
            IntrinsicElementDoNotSignalifyAttributes<TElementTypeString> &
                keyof IntrinsicElementAttributes<TElementTypeString>
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
