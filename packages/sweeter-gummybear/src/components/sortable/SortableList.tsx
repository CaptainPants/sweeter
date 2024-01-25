import {
    $calc,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { SortableListContext } from './internal/SortableListContext.js';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

export type SortableListProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: () => JSX.Element;
    onSortEnd?: (fromIndex: number, toIndex: number) => void;
}>;

export const SortableList: Component<SortableListProps> = ({
    children,
    style,
    class: classNames,
}) => {
    let _ref: HTMLDivElement | undefined;

    return (
        <div ref={(value) => (_ref = value)} style={style} class={classNames}>
            TODO: implement sorting
            {SortableListContext.invokeWith(
                {
                    // placeholder
                },
                () => $calc(() => $val(children)?.()),
            )}
        </div>
    );
};
