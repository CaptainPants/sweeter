import {
    type PropertiesMightBeSignals,
    type Component,
} from '@captainpants/sweeter-core';

export type IconProps = PropertiesMightBeSignals<{
    hoverable?: boolean;
}>;

export interface IconSet {
    Child: Component<IconProps>;
    DragHandle: Component<IconProps>;
    Delete: Component<IconProps>;
    Edit: Component<IconProps>;
    Add: Component<IconProps>;
}
