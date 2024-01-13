import {
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { row } from '../../stylesheets/grid.js';
import { type ElementCssClasses, type ElementCssStyles } from '@captainpants/sweeter-web';

export type RowProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

export const Row: Component<RowProps> = ({
    id,
    children,
    style,
    class: classProp,
    passthrough: { class: classFromPassthroughProps, ...passthroughProps } = {},
}) => {
    return (
        <div
            id={id}
            class={[classFromPassthroughProps, row, classProp]}
            style={style}
            {...passthroughProps}
        >
            {children}
        </div>
    );
};
