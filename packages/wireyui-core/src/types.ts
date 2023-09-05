export interface FactoryContext {}

export type ElementType = Component<unknown> | string | undefined;

type Key = string | number;

/**
 * The result of a JSX expression.
 */
export interface JSXSingleElement {
    readonly type: ElementType;
    readonly key: Key | undefined;
    readonly props: {
        readonly children?: unknown[];
    };
}

export type JSXElement =
    | JSXSingleElement
    | string
    | boolean
    | null
    | undefined
    | JSXElement[];

export interface IntrinsicAttributes {
    readonly key?: Key | undefined;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Component<Props = {}> = (
    props: Props,
    factoryContext: FactoryContext,
) => JSXSingleElement;

/**
 * The goal is to let the -web package provide this
 */
export interface NonComponentProps {}

export type PropsFor<ComponentType extends () => JSXSingleElement> =
    ComponentType extends Component<infer Props> ? Props : NonComponentProps;

export type PropsWithIntrinsicAttributesFor<
    ComponentType extends () => JSXSingleElement,
> = PropsFor<ComponentType> & IntrinsicAttributes;

export type ChildrenTypeFor<ComponentType extends () => JSXSingleElement> =
    PropsFor<ComponentType> extends { children: infer Children }
        ? Children
        : never;

/**
 * Convenience variant of ChildrenType that has result as a tuple that can be used on a rest parameter (e.g. for _jsx)
 */
export type ChildrenTupleFor<ComponentType extends () => JSXSingleElement> =
    PropsFor<ComponentType> extends { children: infer Children }
        ? Children extends unknown[]
            ? Children
            : [Children]
        : [];
