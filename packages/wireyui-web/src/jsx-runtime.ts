import {
    ChildrenTupleFor,
    ComponentOrIntrinsicElementTypeConstraint,
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
): JSX.Element {
    return document.createElement('div');
}
