import { Attributes, ChildrenTuple, ElementType } from "./types";

export function _jsx<ComponentType extends ElementType>(type: ComponentType, attributes: Attributes<ComponentType>, ...children: ChildrenTuple<ComponentType>): JSX.Element {
    const { key, ...restOfAttributes } = attributes;

    const props: { children?: unknown } = restOfAttributes;
    props.children = children;

    const result: JSX.Element = {
        type,
        props: props,
        key
    };

    return result;
}