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
