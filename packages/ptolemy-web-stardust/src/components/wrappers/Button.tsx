import {
    $derived,
    $val,
    type Component,
    type IntrinsicElementPropsInput,
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

    passthroughProps?: IntrinsicElementPropsInput<'button'> | undefined;
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
    passthroughProps: {
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
            $val(variant) ?? 'secondary',
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
