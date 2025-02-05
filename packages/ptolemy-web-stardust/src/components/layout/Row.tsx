import {
    type Component,
    type IntrinsicRawElementAttributes,
    mapProps,
    type Prop,
    type PropertiesAreSignals,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { row } from '../../stylesheets/grid.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'div'>,
    'id'
>;

export type RowProps = {
    id?: string | undefined;

    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
} & {
    passthrough?: Prop<
        PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined>
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
    passthrough: (input) =>
        input !== undefined
            ? mapProps<
                  PropertiesAreSignals<OverridableHtmlAttributes | undefined>
              >(undefined, input)
            : input,
};
