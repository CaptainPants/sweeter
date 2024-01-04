import {
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { row } from '../../stylesheets/grid.js';

export type RowProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

export const Row: Component<RowProps> = ({
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
