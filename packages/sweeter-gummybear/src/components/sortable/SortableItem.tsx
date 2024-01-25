import {
    $calc,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';

export type SortableItemProps = PropertiesMightBeSignals<{
    children?: JSX.Element;
}>;

export const SortableItem: Component<SortableItemProps> = ({ children }) => {
    // inject a marker onto the div so that the relevant sortable knob can find the element to move? OR
    // add a context for each item.
    let _ref: HTMLDivElement | undefined;

    return (
        <div ref={(value) => (_ref = value)}>{$calc(() => $val(children))}</div>
    );
};
