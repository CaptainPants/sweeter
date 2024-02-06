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
    Child: Component<IconProps>;
    DragHandle: Component<IconProps>;
    Delete: Component<IconProps>;
    Edit: Component<IconProps>;
    Add: Component<IconProps>;
}
