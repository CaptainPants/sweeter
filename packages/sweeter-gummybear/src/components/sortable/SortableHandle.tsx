import {
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

export type SortableHandleProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
}>;

export const SortableHandle: Component<SortableHandleProps> = (
    { children, class: classNames, style },
    init,
) => {
    return (
        <div class={classNames} style={style} data-is-knob="true">
            {children}
        </div>
    );
};
