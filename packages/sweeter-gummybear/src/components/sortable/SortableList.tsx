import {
    $calc,
    $peek,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { SortableListContext } from './internal/SortableListContext.js';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';
import Sortable from 'sortablejs';
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

export type SortableListProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: () => JSX.Element;
    onSortEnd?: (fromIndex: number, toIndex: number) => void;
}>;

export const SortableList: Component<SortableListProps> = (
    { children, style: styleProp, class: classNames, onSortEnd },
    init,
) => {
    const style = $calc<ElementCssStyles>(() => {
        const result = $val(styleProp) ?? {};

        result.position = 'relative';

        return result;
    });

    let ref: HTMLDivElement | undefined;

    init.onMount(() => {
        assertNotNullOrUndefined(ref);

        const sortable = Sortable.create(ref, {
            handle: '[data-is-knob]', // knobs not working so disabled
            onEnd(evt) {
                assertNotNullOrUndefined(evt.oldIndex);
                assertNotNullOrUndefined(evt.newIndex);

                $peek(onSortEnd)?.(evt.oldIndex, evt.newIndex);
            },
        });

        return () => {
            sortable.destroy();
        };
    });

    return (
        <div ref={(value) => (ref = value)} style={style} class={classNames}>
            {SortableListContext.invokeWith(
                {
                    // placeholder
                },
                () => $calc(() => $val(children)?.()),
            )}
        </div>
    );
};
