import {
    isSignal,
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
    $calc,
} from '@captainpants/sweeter-core';
import {
    breakpointNameToSizeMap,
    type BreakpointSizeName,
} from '../../stylesheets/internal/constants.js';
import {
    GlobalCssClass,
    type ElementCssStyles,
    stylesheet,
} from '@captainpants/sweeter-web';
import { combineStyles } from '../../internal/combineStyles.js';

export type ContainerProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;

    size?: BreakpointSizeName | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

export const Container: Component<ContainerProps> = ({
    id,
    children,
    size,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const style: ElementCssStyles = {
        "max-width": isSignal(size)
            ? $calc(() =>
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
            class={[classFromPassthroughProps, css]}
            style={combineStyles(style, styleFromPassthroughProps)}
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
