import {
    $calc,
    $val,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { SortableListContext } from './internal/SortableListContext.js';

export type SortableListProps = PropertiesMightBeSignals<{
    children?: () => JSX.Element;
    onSortEnd?: (fromIndex: number, toIndex: number) => void;
}>;

export const SortableList: Component<SortableListProps> = ({ children }) => {
    let _ref: HTMLDivElement | undefined;

    return (
        <div ref={(value) => (_ref = value)}>
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
