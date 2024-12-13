import {
    $derive,
    $peek,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';
import Sortable from 'sortablejs';
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

export type SortableListProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
    useHandle?: boolean;
    onSortEnd?: (fromIndex: number, toIndex: number) => void;
}>;

const handleSelector = '[data-is-knob]' as const;

export const SortableList: Component<SortableListProps> = (
    { children, style: styleProp, class: classNames, onSortEnd, useHandle },
    init,
) => {
    const style = $derive<ElementCssStyles>(() => {
        const result = $val(styleProp) ?? {};

        result.position = 'relative';

        return result;
    });

    let ref: HTMLDivElement | undefined;

    let sortable: Sortable | undefined;

    init.onMount(() => {
        assertNotNullOrUndefined(ref);

        sortable = Sortable.create(ref, {
            handle: useHandle ? handleSelector : undefined, // knobs not working so disabled
            onEnd(evt) {
                assertNotNullOrUndefined(evt.oldIndex);
                assertNotNullOrUndefined(evt.newIndex);

                // Revert element to where it was, as we are not in charge of where it is in this component
                if (evt.oldIndex > evt.newIndex) {
                    evt.from.insertBefore(
                        evt.item,
                        evt.from.childNodes.item(evt.oldIndex + 1),
                    );
                } else {
                    evt.from.insertBefore(
                        evt.item,
                        evt.from.childNodes.item(evt.oldIndex),
                    );
                }

                $peek(onSortEnd)?.(evt.oldIndex, evt.newIndex);
            },
        });

        return () => {
            sortable?.destroy();
        };
    });

    init.onSignalChange([useHandle], ([useHandle]) => {
        sortable?.option('handle', useHandle ? handleSelector : undefined);
    });

    return (
        <div ref={(value) => (ref = value)} style={style} class={classNames}>
            {children}
        </div>
    );
};
