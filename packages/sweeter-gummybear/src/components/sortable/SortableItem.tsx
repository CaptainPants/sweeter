import {
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

export type SortableItemProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
}>;

export const SortableItem: Component<SortableItemProps> = ({
    children,
    style,
    class: classNames,
}) => {
    // inject a marker onto the div so that the relevant sortable knob can find the element to move? OR
    // add a context for each item.
    let _ref: HTMLDivElement | undefined;

    return (
        <div ref={(value) => (_ref = value)} class={classNames} style={style}>
            {children}
        </div>
    );
};
