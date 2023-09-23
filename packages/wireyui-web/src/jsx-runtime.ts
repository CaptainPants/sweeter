import {
    ChildrenTupleFor,
    ComponentOrIntrinsicElementTypeConstraint,
    JSXElement,
    PropsWithIntrinsicAttributesFor,
} from '@captainpants/wireyui-core';

export function jsx<
    ComponentType extends ComponentOrIntrinsicElementTypeConstraint,
>(
    type: ComponentType,
    attributes: Omit<
        PropsWithIntrinsicAttributesFor<ComponentType>,
        'children'
    >,
    ...children: ChildrenTupleFor<ComponentType>
): JSXElement {
    return document.createElement('div');
}
