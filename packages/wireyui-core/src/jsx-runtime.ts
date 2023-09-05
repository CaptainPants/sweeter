import {
    PropsWithIntrinsicAttributesFor,
    ChildrenTupleFor,
    JSXElement,
    JSXSingleElement,
} from './types';

export function jsx<ComponentType extends () => JSXSingleElement>(
    type: ComponentType,
    attributes: PropsWithIntrinsicAttributesFor<ComponentType>,
    ...children: ChildrenTupleFor<ComponentType>
): JSX.Element {
    if (!attributes.key && children.length < 1) {
        return {
            type,
            props: attributes as { readonly children?: unknown[] },
            key: undefined,
        };
    }

    const { key, ...restOfAttributes } = attributes;

    const props: { children?: unknown[] } = restOfAttributes;
    props.children = children;

    const result: JSXElement = {
        type,
        props,
        key,
    };

    return result;
}
