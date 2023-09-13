export interface FactoryContext {}

export type JSXKey = string | number;

export type JSXElement = JSX.Element;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Component<Props = {}> = (
    props: Props,
    factoryContext: FactoryContext,
) => JSXElement;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentOrIntrinsicElementTypeConstraint = Component<any> | string;

/**
 * The goal is to let the -web package provide this
 */
export type IntrinsicElementProps<ElementName> =
    ElementName extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[ElementName]
        : never;

export type PropsFor<
    ComponentOrIntrinsicElementType extends
        ComponentOrIntrinsicElementTypeConstraint,
> = ComponentOrIntrinsicElementType extends Component<infer Props>
    ? Props
    : IntrinsicElementProps<ComponentOrIntrinsicElementType>;

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
 * Convenience variant of ChildrenType that has result as a tuple that can be used on a rest parameter (e.g. for _jsx)
 */
export type ChildrenTupleFor<
    ComponentType extends ComponentOrIntrinsicElementTypeConstraint,
> = PropsFor<ComponentType> extends { children: infer Children }
    ? Children extends unknown[]
        ? Children
        : [Children]
    : [];
