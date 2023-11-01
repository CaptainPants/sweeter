import type { Context } from './index.js';
import type { UnionToIntersection } from './internal/UnionToIntersection.js';
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
type IfSpecified<T, TData> = [T] extends [undefined] ? {} : TData;

// There may be extensions to this later, with Setup becoming SetupFunction & { other() => void };
export type ComponentInit = ComponentInitFunction & {
    onMount: (callback: () => (() => void) | void) => void;
    onUnMount: (callback: () => void) => void;
    subscribeToChanges: (
        dependencies: readonly unknown[],
        callback: () => void,
    ) => void;
    getContext: <T>(context: Context<T>) => T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Component<TProps = {}, TAsyncInitializationResult = undefined> = ((
    props: Props<TProps>,
    init: ComponentInit,
    asyncInitializerResult: TAsyncInitializationResult,
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

export type IntrinsicElementProps<TElementTypeString extends string> =
    IntrinsicElementAttributes<TElementTypeString>;

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

/**
 * Take a props interface and make each property optionally a Signal.
 * You should ensure that the values aren't signals already.
 */
export type Props<TProps, TDoNotSignalifyProperties extends string = never> = {
    [Key in keyof TProps]: Key extends TDoNotSignalifyProperties
        ? TProps[Key]
        : Signal<TProps[Key]> | TProps[Key];
};

/**
 * Extended by declaration merging into IntrinsicElementNamesParts and IntrinsicElementAttributeParts.
 */
export type IntrinsicElementAttributes<TElementTypeString extends string> =
    UnionToIntersection<
        WireyExtensionPoints.IntrinsicElementAttributesParts<TElementTypeString>[keyof WireyExtensionPoints.IntrinsicElementAttributesParts<TElementTypeString>]
    >;

/**
 * Extended by declaration merging into RendererHostElementParts.
 */
export type IntrinsicElementDoNotSignalifyAttributes =
    WireyExtensionPoints.IntrinsicElementDoNotSignalifyAttributesParts[keyof WireyExtensionPoints.IntrinsicElementDoNotSignalifyAttributesParts];

/**
 * Extended by declaration merging into RendererHostElementParts.
 */
export type RendererHostElement =
    WireyExtensionPoints.RendererHostElementParts[keyof WireyExtensionPoints.RendererHostElementParts];

/**
 * Extended by declaration merging into IntrinsicElementPossibilityParts.
 */
export type IntrinsicElement =
    WireyExtensionPoints.IntrinsicElementPossibilityParts[keyof WireyExtensionPoints.IntrinsicElementPossibilityParts];
