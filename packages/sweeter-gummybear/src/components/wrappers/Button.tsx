import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
} from '@captainpants/sweeter-core';
import { type VariantName } from '../../internal/constants.js';
import {
    type TypedEvent,
    type ElementCssClasses,
} from '@captainpants/sweeter-web';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { button } from '../../stylesheets/button.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type ButtonProps = PropertiesMightBeSignals<{
    children?: JSX.Element | undefined;

    variant?: VariantName | undefined;
    outline?: boolean | undefined;
    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;

    id?: string | undefined;

    onclick?:
        | ((evt: TypedEvent<HTMLButtonElement, MouseEvent>) => void)
        | undefined;
}> & {
    passthroughProps?: IntrinsicElementProps<'button'> | undefined;
};

export const Button: Component<ButtonProps> = ({
    children,
    variant,
    id,
    onclick,
    outline,
    disabled,
    fillWidth,
    passthroughProps: {
        class: classFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $calc(() => {
        const result: ElementCssClasses = [];

        applyStandardClasses(
            result,
            {
                outline: $val(outline),
                disabled: $val(disabled),
                fillWidth: $val(fillWidth),
            },
            $val(variant),
        );

        return result;
    });

    return (
        <button
            id={id}
            onclick={combineEventHandlers(onclick, onclickFromPassthroughProps)}
            disabled={disabled}
            class={[classFromPassthroughProps, classesFromProps, button]}
            {...passthroughProps}
        >
            {children}
        </button>
    );
};
