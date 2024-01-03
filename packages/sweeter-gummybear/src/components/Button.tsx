import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
} from '@captainpants/sweeter-core';
import { type VariantName } from '../internal/constants.js';
import {
    type TypedEvent,
    type ElementCssClasses,
} from '@captainpants/sweeter-web';
import { tags, variants } from '../stylesheets/markers.js';
import { combineHandlers } from '../internal/combineHandlers.js';

export type ButtonProps = PropertiesMightBeSignals<{
    children: JSX.Element;

    variant?: VariantName | undefined;
    outline?: boolean;
    disabled?: boolean;

    onclick?: (evt: TypedEvent<HTMLButtonElement, MouseEvent>) => void;
}> & {
    buttonProps: IntrinsicElementProps<'button'>;
};

export const Button: Component<ButtonProps> = ({
    children,
    variant,
    onclick,
    outline = false,
    disabled = false,
    buttonProps: {
        class: classFromButtonProps,
        onclick: onclickFromButtonProps,
        ...buttonProps
    },
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
            onclick={combineHandlers(onclick, onclickFromButtonProps)}
            disabled={disabled}
            class={[classFromButtonProps, fromVariantsSignal]}
            {...buttonProps}
        >
            {children}
        </button>
    );
};
