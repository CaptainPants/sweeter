import {
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { row } from '../../stylesheets/grid.js';

export type ContainerProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

export const Container: Component<ContainerProps> = ({
    id,
    children,
    passthrough: { class: classFromPassthroughProps, ...passthroughProps } = {},
}) => {
    return (
        <div
            id={id}
            class={[classFromPassthroughProps, row]}
            {...passthroughProps}
        >
            {children}
        </div>
    );
};
