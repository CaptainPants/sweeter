import {
    $calc,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    GlobalCssClass,
    stylesheet,
    type TypedEvent,
} from '@captainpants/sweeter-web';
import { SortableListContext } from './internal/SortableListContext.js';

export type SortableKnobProps = PropertiesMightBeSignals<{
    children?: () => JSX.Element;
}>;

export const SortableKnob: Component<SortableKnobProps> = (
    { children },
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
        <div class={css} onmousedown={onMouseDown}>
            {$calc(() => $val(children)?.())}
        </div>
    );
};

const css = new GlobalCssClass({
    className: 'SortableKnob',
    content: stylesheet`
        cursor: 'move'
    `,
});
