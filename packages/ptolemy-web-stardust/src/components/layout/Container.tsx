import {
    $derived,
    type Component,
    type IntrinsicRawElementAttributes,
    isSignal,
    mapProps,
    Prop,
    PropertiesAreSignals,
    PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
    GlobalCssClass,
    stylesheet,
} from '@serpentis/ptolemy-web';

import { combineStyles } from '../../internal/combineStyles.js';
import {
    breakpointNameToSizeMap,
    type BreakpointSizeName,
} from '../../stylesheets/internal/constants.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'div'>,
    'class'
>;

export interface ContainerProps {
    id?: string | undefined;

    children?: JSX.Element | undefined;

    size?: BreakpointSizeName | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;

    passthrough?: Prop<
        PropertiesMightBeSignals<OverridableHtmlAttributes>,
        PropertiesAreSignals<OverridableHtmlAttributes>
    >;
}

export const Container: Component<ContainerProps> = ({
    id,
    children,
    size,
    class: classProp,
    style,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const sizeStyle: ElementCssStyles = {
        'max-width': isSignal(size)
            ? $derived(() =>
                  size.value
                      ? `${breakpointNameToSizeMap[size.value]}px`
                      : undefined,
              )
            : typeof size !== 'undefined'
              ? `${breakpointNameToSizeMap[size]}px`
              : undefined,
    };

    return (
        <div
            id={id}
            class={[css, classFromPassthroughProps, classProp]}
            style={combineStyles(sizeStyle, style, styleFromPassthroughProps)}
            {...passthroughProps}
        >
            {children}
        </div>
    );
};

const css = new GlobalCssClass({
    className: 'container',
    content: stylesheet`
        margin: 0 auto;
    `,
});

Container.propMappings = {
    passthrough: input => mapProps<PropertiesAreSignals<OverridableHtmlAttributes>>(undefined, input)
}