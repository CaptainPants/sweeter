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
import { tags, variants } from '../../stylesheets/markers.js';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { button } from '../../stylesheets/button.js';

export type ButtonProps = PropertiesMightBeSignals<{
    children?: JSX.Element | undefined;

    variant?: VariantName | undefined;
    outline?: boolean | undefined;
    disabled?: boolean | undefined;

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
    outline = false,
    disabled = false,
    passthroughProps: {
        class: classFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const fromVariantsSignal = $calc(() => {
        const fromVariants: ElementCssClasses = [];

        const resolvedVariant = $val(variant);
        if (resolvedVariant) {
            variants[resolvedVariant];
        }

        if ($val(outline)) {
            fromVariants.push(tags.outline);
        }

        if ($val(disabled)) {
            fromVariants.push(tags.disabled);
        }

        return fromVariants;
    });

    return (
        <button
            id={id}
            onclick={combineEventHandlers(onclick, onclickFromPassthroughProps)}
            disabled={disabled}
            class={[classFromPassthroughProps, fromVariantsSignal, button]}
            {...passthroughProps}
        >
            {children}
        </button>
    );
};
