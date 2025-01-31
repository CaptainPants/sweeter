import { IsNever, type UnionToIntersection } from '@serpentis/ptolemy-utilities';

import { type Context } from './context/Context.js';
import { type Runtime } from './runtime/Runtime.js';
import { type Signal, type UnsignalAll } from './signals/types.js';

export type JSXKey = string | number;

export type JSXElement =
    | IntrinsicElement
    | Signal<JSXElement>
    | readonly JSXElement[];

export type JSXIntrinsicElements = {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    [Key in PtolemyExtensionPoints.IntrinsicElementNames[keyof PtolemyExtensionPoints.IntrinsicElementNames] &
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

export interface IdGenerator {
    next: (basis?: string) => string;
}

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
     * Subscribe to signals while mounted, with optional cleanup functions called before the next callback / unmount.
     *
     * The callback is invoked on mount with the current value of the signals.
     *
     * The subscription is removed and cleanup function called  while unmounted.
     *
     * @param dependencies Subscribe to each of these dependencies
     * @param callback Call this method any time one of the dependencies changes
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
    ): () => void;
    getContext<T>(context: Context<T>): T;

    readonly idGenerator: IdGenerator;

    readonly runtime: Runtime;

    /**
     * This is true while the Init object is valid to use, I.e. during initialization. It is then set to false, and all methods will throw when used.
     */
    isValid: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- utility to represent that a component has no props
export type NoProps = {};

export type Component<TProps = NoProps> = (
    props: PropsDef<TProps>,
    init: ComponentInit,
) => JSX.Element;

export type PropTreatment<T, Transform extends boolean | undefined> = { "__TRANSFORM__": Transform, raw: T };

type HasUndefined<T> = true extends (T extends undefined ? true : false) ? true : false;

export type FixOptionalPropTreatment<T> =
    [undefined] extends [T] ? 
        [T] extends [PropTreatment<infer S, infer U> | undefined] ? Exclude<T, PropTreatment<S, U> | undefined> | PropTreatment<S | undefined, U> : T
    : T;

export type ComponentOrIntrinsicElementTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any> | string;
export type ComponentTypeConstraint =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component<any>;

export type JSXResultForComponentOrElementType<
    ComponentType extends ComponentOrIntrinsicElementTypeConstraint,
> = ComponentType extends string
    ? PtolemyExtensionPoints.IntrinsicElementNameToType<ComponentType>[keyof PtolemyExtensionPoints.IntrinsicElementNameToType<ComponentType>]
    : JSXElement;

export type PropInput<Prop> = 
    IsNever<Prop> extends true ? MightBeSignal<Prop>
    : [FixOptionalPropTreatment<Prop>] extends [PropTreatment<infer S, false>] ? S // Is a signal, DO NOT transform
    : [FixOptionalPropTreatment<Prop>] extends [PropTreatment<infer S, true>] ? MightBeSignal<S> // Is NOT a signal, DO transform
    : [Prop] extends [Signal<infer _>] ? Prop  // Is a signal, DO NOT transform
    : MightBeSignal<Prop>; // Otherwise not a signal, DO transform

/**
 * The usage of a Props object, for creating the actual component.
 * 
 * If the property is a signal, allow a non-signal and we'll wrap it
 */
export type PropsInput<Props> = {
    [Key in keyof Props]: PropInput<Props[Key]>
}

export type PropDef<Prop> = 
    IsNever<Prop> extends true ? Signal<Prop>
    : [FixOptionalPropTreatment<Prop>] extends [PropTreatment<infer S, false>] ? S // Is a signal, DO NOT transform
    : [FixOptionalPropTreatment<Prop>] extends [PropTreatment<infer S, true>] ? Signal<S> // Is NOT a signal, DO transform
    : [Prop] extends [Signal<infer _>] ? Prop  // Is a signal, DO NOT transform
    : Signal<Prop>; // Otherwise not a signal, DO transform

/**
 * The definition of a Props object, for creating a component definition function.
 * 
 * All properties should be signals, make them signals if not
 */
export type PropsDef<Props> = {
    [Key in keyof Props]: PropDef<Props[Key]>
}

export type PropsFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> =
    ComponentOrIntrinsicElementTypeString extends Component<infer Props>
        ? PropsInput<Props>
        : ComponentOrIntrinsicElementTypeString extends string
          ? IntrinsicElementProps<ComponentOrIntrinsicElementTypeString>
          : never;

/**
 * 
 */
export type PropsAndIntrinsicAttributesFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> = PropsFor<ComponentOrIntrinsicElementTypeString> & JSX.IntrinsicAttributes;

export type ChildrenTypeFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> =
    PropsFor<ComponentOrIntrinsicElementTypeString> extends {
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
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        UnionToIntersection<
            PtolemyExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>[keyof PtolemyExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>]
        >;

/**
 * Extended by declaration merging into RuntimeRootHostElementTypes.
 */
export type IntrinsicElementDoNotSignalifyAttributes<
    TElementTypeString extends string,
> =
    PtolemyExtensionPoints.SkipSignalifyingIntrinsicElementAttributes<TElementTypeString>[keyof PtolemyExtensionPoints.SkipSignalifyingIntrinsicElementAttributes<TElementTypeString>];

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementProps<TElementTypeString extends string> =
    PropertiesMightBeSignals<
        Omit<
            IntrinsicElementAttributes<TElementTypeString>,
            // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
            IntrinsicElementDoNotSignalifyAttributes<TElementTypeString> &
                keyof IntrinsicElementAttributes<TElementTypeString>
        >
    > &
        Pick<
            IntrinsicElementAttributes<TElementTypeString>,
            // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
            IntrinsicElementDoNotSignalifyAttributes<TElementTypeString> &
                keyof IntrinsicElementAttributes<TElementTypeString>
        >;

/**
 * Extended by declaration merging into RuntimeRootHostElementTypes.
 */
export type RuntimeRootHostElement =
    PtolemyExtensionPoints.RuntimeRootHostElementTypes[keyof PtolemyExtensionPoints.RuntimeRootHostElementTypes];

/**
 * Extended by declaration merging into IntrinsicElementTypes.
 */
export type IntrinsicElement =
    PtolemyExtensionPoints.IntrinsicElementTypes[keyof PtolemyExtensionPoints.IntrinsicElementTypes];
