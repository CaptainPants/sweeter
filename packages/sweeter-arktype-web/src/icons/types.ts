import {
    type PropertiesMightBeSignals,
    type Component,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

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
