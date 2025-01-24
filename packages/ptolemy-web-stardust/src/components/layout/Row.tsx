import {
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { row } from '../../stylesheets/grid.js';

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
