import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
    type ReadWriteSignal,
} from '@captainpants/sweeter-core';
import { type VariantName } from '../../internal/constants.js';
import {
    type TypedEvent,
    type ElementCssClasses,
    type InputType,
} from '@captainpants/sweeter-web';
import { forms } from '../../index.js';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type InputProps = PropertiesMightBeSignals<{
    type?: InputType | undefined;

    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;

    id?: string | undefined;

    value?: string | undefined;
    placeholder?: string | undefined;

    onInput?: ((evt: TypedEvent<HTMLInputElement, Event>) => void) | undefined;
}> & {
    'bind:value'?: ReadWriteSignal<string> | undefined;

    passthroughProps?: IntrinsicElementProps<'input'> | undefined;
};

export const Input: Component<InputProps> = ({
    type,
    variant,
    disabled,
    readOnly,
    fillWidth,
    invalid,
    id,
    value,
    'bind:value': bindValue,
    placeholder,
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
        <input
            id={id}
            type={type}
            value={value}
            bind:value={bindValue}
            disabled={disabled}
            readonly={readOnly}
            placeholder={placeholder}
            oninput={combineEventHandlers(onInput, oninputFromPassthroughProps)}
            class={[classFromPassthroughProps, classesFromProps, forms.input]}
            {...passthroughProps}
        />
    );
};
