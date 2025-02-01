import Sortable from 'sortablejs';

import {
    $derived,
    type Component,
} from '@serpentis/ptolemy-core';
import { assertNotNullOrUndefined } from '@serpentis/ptolemy-utilities';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

export interface SortableListProps {
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
    useHandle?: boolean;
    onSortEnd?: (fromIndex: number, toIndex: number) => void;
};

const handleSelector = '[data-is-knob]';

export const SortableList: Component<SortableListProps> = (
    { children, style: styleProp, class: classNames, onSortEnd, useHandle },
    init,
) => {
    const style = $derived<ElementCssStyles>(() => {
        const result = { ...styleProp?.value };

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

                onSortEnd?.peek()?.(evt.oldIndex, evt.newIndex);
            },
        });

        return () => {
            sortable?.destroy();
            sortable = undefined; // Make sure we don't keep around a reference to the destroyed sortable and try to use it..
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
