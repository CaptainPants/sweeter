import {
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
    type TypedEvent,
} from '@captainpants/sweeter-web';
import { SortableListContext } from './internal/SortableListContext.js';

export type SortableKnobProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
}>;

export const SortableKnob: Component<SortableKnobProps> = (
    { children, class: classNames, style },
    init,
) => {
    const _context = init.getContext(SortableListContext);

    function onMouseDown(
        this: HTMLDivElement,
        evt: TypedEvent<HTMLDivElement, MouseEvent>,
    ) {
        // Triggers dragging, and probably registers a document handler
    }

    return (
        <div
            onmousedown={onMouseDown}
            class={classNames}
            style={style}
            data-is-knob="true"
        >
            {children}
        </div>
    );
};
