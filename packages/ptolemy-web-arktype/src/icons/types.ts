import {
    type Component,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

export type IconProps = PropertiesMightBeSignals<{
    hoverable?: boolean | undefined;
    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
}>;

export interface IconSet {
    readonly Child: Component<IconProps>;
    readonly DragHandle: Component<IconProps>;
    readonly Delete: Component<IconProps>;
    readonly Edit: Component<IconProps>;
    readonly Add: Component<IconProps>;
}
