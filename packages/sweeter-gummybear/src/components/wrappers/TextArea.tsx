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
import { forms } from '../../index.js';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type TextAreaProps = PropertiesMightBeSignals<{
    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;

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
    disabled,
    readOnly,
    fillWidth,
    invalid,
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
    const classesFromProps = $calc(() => {
        const result: ElementCssClasses = [];

        applyStandardClasses(
            result,
            {
                disabled: $val(disabled),
                fillWidth: $val(fillWidth),
                invalid: $val(invalid),
            },
            $val(variant),
        );

        return result;
    });

    return (
        <textarea
            id={id}
            value={value}
            bind:value={bindValue}
            disabled={disabled}
            readonly={readOnly}
            oninput={combineEventHandlers(onInput, oninputFromPassthroughProps)}
            class={[classFromPassthroughProps, classesFromProps, forms.input]}
            {...passthroughProps}
        />
    );
};
