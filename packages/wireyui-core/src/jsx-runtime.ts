import {
    Attributes,
    ChildrenTupleFor,
    JSXElement,
    JSXSingleElement,
} from './types';

export function jsx<ComponentType extends () => JSXSingleElement>(
    type: ComponentType,
    attributes: Attributes<ComponentType>,
    ...children: ChildrenTupleFor<ComponentType>
): JSX.Element {
    const { key, ...restOfAttributes } = attributes;

    const props: { children?: unknown[] } = restOfAttributes;
    props.children = children;

    const result: JSXElement = {
        type,
        props: props,
        key,
    };

    return result;
}
