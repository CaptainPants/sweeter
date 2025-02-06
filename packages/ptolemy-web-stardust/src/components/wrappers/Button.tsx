import {
    $derived,
    $val,
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
    type TypedEvent,
} from '@serpentis/ptolemy-web';

import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { type VariantName } from '../../internal/constants.js';
import { button } from '../../stylesheets/button.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'button'>,
    'id'
>;

export type ButtonProps = {
    children?: JSX.Element | undefined;

    variant?: VariantName | undefined;
    outline?: boolean | undefined;
    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;

    id?: string | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;

    onclick?:
        | ((evt: TypedEvent<HTMLButtonElement, MouseEvent>) => void)
        | undefined;

    passthrough?: Prop<
        PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined>
    >;
};

export const Button: Component<ButtonProps> = ({
    children,
    variant,
    id,
    onclick,
    outline,
    disabled,
    fillWidth,
    class: classProp,
    style,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $derived(() => {
        const result: ElementCssClasses = [];

        applyStandardClasses(
            result,
            {
                outline: $val(outline),
                disabled: $val(disabled),
                fillWidth: $val(fillWidth),
            },
            variant?.value ?? 'secondary',
        );

        return result;
    });

    return (
        <button
            id={id}
            onclick={combineEventHandlers(onclick, onclickFromPassthroughProps)}
            disabled={disabled}
            class={[
                classFromPassthroughProps,
                classesFromProps,
                button,
                classProp,
            ]}
            style={combineStyles(style, styleFromPassthroughProps)}
            {...passthroughProps}
        >
            {children}
        </button>
    );
};
Button.propMappings = {
    passthrough: (input) =>
        mapProps<PropertiesAreSignals<OverridableHtmlAttributes | undefined>>(
            undefined,
            input,
        ),
};
