export interface FactoryContext {}

export type JSXKey = string | number;

export type JSXElement = JSX.Element;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Component<Props = {}> = (
    props: Props,
    factoryContext: FactoryContext,
) => JSXElement;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ElementTypeConstraint = Component<any> | string;

/**
 * The goal is to let the -web package provide this
 */
export type NonComponentProps<ElementName> =
    ElementName extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[ElementName]
        : { _unrecognized: 1 };

export type PropsFor<ComponentType extends ElementTypeConstraint> =
    ComponentType extends Component<infer Props>
        ? Props
        : NonComponentProps<ComponentType>;

export type PropsWithIntrinsicAttributesFor<
    ComponentType extends ElementTypeConstraint,
> = PropsFor<ComponentType> & JSX.IntrinsicAttributes;

export type ChildrenTypeFor<ComponentType extends ElementTypeConstraint> =
    PropsFor<ComponentType> extends { children: infer Children }
        ? Children
        : never;

/**
 * Convenience variant of ChildrenType that has result as a tuple that can be used on a rest parameter (e.g. for _jsx)
 */
export type ChildrenTupleFor<ComponentType extends ElementTypeConstraint> =
    PropsFor<ComponentType> extends { children: infer Children }
        ? Children extends unknown[]
            ? Children
            : [Children]
        : [];
