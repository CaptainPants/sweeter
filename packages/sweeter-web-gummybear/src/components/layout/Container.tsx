import {
    isSignal,
    type Component,
    type IntrinsicElementAttributes,
    type PropertiesMightBeSignals,
    $derive,
} from '@captainpants/sweeter-core';
import {
    breakpointNameToSizeMap,
    type BreakpointSizeName,
} from '../../stylesheets/internal/constants.js';
import {
    GlobalCssClass,
    type ElementCssStyles,
    stylesheet,
    type ElementCssClasses,
} from '@captainpants/sweeter-web';
import { combineStyles } from '../../internal/combineStyles.js';

export type ContainerProps = PropertiesMightBeSignals<{
    id?: string | undefined;

    children?: JSX.Element | undefined;

    size?: BreakpointSizeName | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
}> & {
    passthrough?: IntrinsicElementAttributes<'div'>;
};

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
            ? $derive(() =>
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
