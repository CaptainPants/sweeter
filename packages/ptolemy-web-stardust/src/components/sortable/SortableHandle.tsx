import {
    type Component,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

export type SortableHandleProps = PropertiesMightBeSignals<{
    class?: ElementCssClasses;
    style?: ElementCssStyles;
    children?: JSX.Element;
}>;

export const SortableHandle: Component<SortableHandleProps> = ({
    children,
    class: classNames,
    style,
}) => {
    return (
        <div class={classNames} style={style} data-is-knob="true">
            {children}
        </div>
    );
};
