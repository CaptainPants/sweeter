import { Attributes, ChildrenTupleFor, JSXElement } from "./types";

export function jsx<ComponentType extends () => JSXElement>(
    type: ComponentType, 
    attributes: Attributes<ComponentType>, 
    ...children: ChildrenTupleFor<ComponentType>
): JSX.Element {
    const { key, ...restOfAttributes } = attributes;

    const props: { children?: unknown[] } = restOfAttributes;
    props.children = children;

    const result: JSX.Element = {
        type,
        props: props,
        key
    };

    return result;
}