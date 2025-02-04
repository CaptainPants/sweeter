import {
    mapProps,
    Prop,
    PropertiesAreSignals,
    PropertiesMightBeSignals,
    type Component,
    type IntrinsicRawElementAttributes,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { row } from '../../stylesheets/grid.js';

type OverridableHtmlAttributes = IntrinsicRawElementAttributes<'div'>

export type RowProps = {
    id?: string | undefined;

    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
} & {
    passthrough?: Prop<
        PropertiesMightBeSignals<OverridableHtmlAttributes>,
        PropertiesAreSignals<OverridableHtmlAttributes>
    >;
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

Row.propMappings = {
    passthrough: input => mapProps<PropertiesAreSignals<OverridableHtmlAttributes>>(undefined, input)
}