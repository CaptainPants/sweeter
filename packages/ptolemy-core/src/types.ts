import {
    IsAny,
    IsNever,
    type UnionToIntersection,
} from '@serpentis/ptolemy-utilities';

import { type Context } from './context/Context.js';
import { type Runtime } from './runtime/Runtime.js';
import {
    type Signal,
    type UnsignalAll,
    type WritableSignal,
} from './signals/types.js';

export type JSXKey = string | number;

export type JSXElement =
    | IntrinsicElement
    | Signal<JSXElement>
    | readonly JSXElement[];

export type JSXIntrinsicElements = {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    [Key in PtolemyExtensionPoints.IntrinsicElementNames[keyof PtolemyExtensionPoints.IntrinsicElementNames] &
        string]: IntrinsicElementPropsInput<Key>;
};

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

export type Component<TProps = NoProps> = {
    (props: PropsDef<TProps>, init: ComponentInit): JSX.Element;

    propMapping?: Partial<
        Record<keyof TProps, false | ((raw: unknown) => unknown)>
    >;
};

export type Prop<TInput, TOutput> = TOutput & {
    readonly __PROP_TREATMENT__: {
        input: TInput;
    };
};

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

// The [] extends [] pattern and the _RemoveUndefined pattern is required because boolean becomes true | false at the drop of a hat
// In an ideal world we might work out an alternative..
type _RemoveUndefined<T> = Exclude<T, undefined>;

export type PropInputFromDefinition<PropDefinition> =
    IsAny<PropDefinition> extends true // Deal with any explicitly so it doesn't do anything weird
        ? PropDefinition
        : [_RemoveUndefined<PropDefinition>] extends [
                Prop<infer Input, infer _Output>,
            ] // If there was an override, use its input type
          ? Input
          : [_RemoveUndefined<PropDefinition>] extends [Signal<infer S>] // If it was a signal, allow either the signal or the signals value type
            ? MightBeSignal<S>
            : PropDefinition; // Otherwise just use as is

export type PropDef<TProp> =
    IsAny<TProp> extends true // Deal with any explicitly so it doesn't do anything weird
        ? Signal<TProp>
        : IsNever<TProp> extends true // never => Signal<never>, mostly so the empty JSX types on ptolemy-core work nicely
          ? Signal<never>
          : [_RemoveUndefined<TProp>] extends [
                  Prop<infer _Input, infer _Output>,
              ] // If its a Prop, keep it
            ? TProp // Preserve the PropInput structure
            : Signal<TProp>; // Otherwise make it a signal

/**
 * The usage of a Props object, for creating the actual component.
 *
 * If the property is a signal, allow a non-signal and we'll wrap it
 */
export type PropsInputFromDef<DefinedProps> = {
    [Key in keyof DefinedProps]: PropInputFromDefinition<DefinedProps[Key]>;
};

export type PropsDef<DefinedProps> = {
    [Key in keyof DefinedProps]: PropDef<DefinedProps[Key]>;
};

export type PropsInputFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> =
    ComponentOrIntrinsicElementTypeString extends Component<
        infer _PropsDefinition
    >
        ? PropsInputFromDef<
              Parameters<ComponentOrIntrinsicElementTypeString>[0]
          >
        : ComponentOrIntrinsicElementTypeString extends string
          ? IntrinsicElementPropsInput<ComponentOrIntrinsicElementTypeString>
          : never;

          export type ChildrenTypeFor<
    ComponentOrIntrinsicElementTypeString extends
        ComponentOrIntrinsicElementTypeConstraint,
> =
    PropsInputFor<ComponentOrIntrinsicElementTypeString> extends {
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
export type PropertiesAreSignals<TProps> = {
    [Key in keyof TProps]: Signal<TProps[Key]>;
};

/**
 * Extended by declaration merging into IntrinsicElementNames and IntrinsicElementAttributeParts.
 */
export type IntrinsicRawElementAttributes<TElementTypeString extends string> =
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        UnionToIntersection<
            PtolemyExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>[keyof PtolemyExtensionPoints.IntrinsicElementAttributeByElementNameString<TElementTypeString>]
        > & { children?: JSXElement };

type _BindPrefixedKeys<T> = keyof T extends `bind:${infer _S}`
    ? keyof T
    : never;
type _NonBindKeys<T> = Exclude<keyof T, _BindPrefixedKeys<T>>;
type _BindProperties<T> = {
    [Key in keyof _BindPrefixedKeys<T>]: WritableSignal<
        _BindPrefixedKeys<T>[Key]
    >;
};

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementPropsInput<TElementTypeString extends string> =
    PropertiesMightBeSignals<
        Pick<
            IntrinsicRawElementAttributes<TElementTypeString>,
            _NonBindKeys<IntrinsicRawElementAttributes<TElementTypeString>>
        >
    > &
        _BindProperties<IntrinsicRawElementAttributes<TElementTypeString>>;

/**
 * Props for intrinsic elements, based on the type string.
 */
export type IntrinsicElementPropsDef<TElementTypeString extends string> =
    PropertiesAreSignals<
        Omit<
            IntrinsicRawElementAttributes<TElementTypeString>,
            _NonBindKeys<IntrinsicRawElementAttributes<TElementTypeString>>
        >
    > &
        _BindProperties<IntrinsicRawElementAttributes<TElementTypeString>>;

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
