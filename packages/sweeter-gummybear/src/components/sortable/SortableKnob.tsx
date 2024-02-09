import {
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

export type SortableKnobProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
}>;

export const SortableKnob: Component<SortableKnobProps> = (
    { children, class: classNames, style },
    init,
) => {
    return (
        <div class={classNames} style={style} data-is-knob="true">
            {children}
        </div>
    );
};
