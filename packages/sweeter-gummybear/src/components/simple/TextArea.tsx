import { $calc, $val } from '@captainpants/sweeter-core';
import {
    type ReadWriteSignal,
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { type VariantName } from '../../internal/constants.js';
import {
    type TypedEvent,
    type ElementCssClasses,
} from '@captainpants/sweeter-web';
import { tags, variants } from '../../stylesheets/markers.js';
import { forms } from '../../index.js';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';

export type TextAreaProps = PropertiesMightBeSignals<{
    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;

    id?: string | undefined;

    value?: string | undefined;

    onInput?:
        | ((evt: TypedEvent<HTMLTextAreaElement, Event>) => void)
        | undefined;
}> & {
    'bind:value'?: ReadWriteSignal<string> | undefined;

    passthroughProps?: IntrinsicElementProps<'textarea'> | undefined;
};

export const TextArea: Component<TextAreaProps> = ({
    variant,
    disabled = false,
    readOnly = false,
    id,
    value,
    'bind:value': bindValue,
    onInput,
    passthroughProps: {
        class: classFromPassthroughProps,
        oninput: oninputFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const fromVariantsSignal = $calc(() => {
        const fromVariants: ElementCssClasses = [];

        const resolvedVariant = $val(variant);
        if (resolvedVariant) {
            variants[resolvedVariant];
        }

        if ($val(disabled)) {
            fromVariants.push(tags.disabled);
        }

        return fromVariants;
    });

    return (
        <textarea
            id={id}
            value={value}
            bind:value={bindValue}
            disabled={disabled}
            readonly={readOnly}
            oninput={combineEventHandlers(onInput, oninputFromPassthroughProps)}
            class={[classFromPassthroughProps, fromVariantsSignal, forms.input]}
            {...passthroughProps}
        />
    );
};
