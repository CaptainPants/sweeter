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
    type ThreeValueBoolean,
} from '@captainpants/sweeter-web';
import { forms } from '../../index.js';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type CheckBoxProps = PropertiesMightBeSignals<{
    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;

    id?: string | undefined;

    checked?: ThreeValueBoolean | undefined;
    placeholder?: string | undefined;

    onInput?: ((evt: TypedEvent<HTMLInputElement, Event>) => void) | undefined;
}> & {
    'bind:checked'?: ReadWriteSignal<ThreeValueBoolean> | undefined;

    passthroughProps?: IntrinsicElementProps<'input'> | undefined;
};

export const CheckBox: Component<CheckBoxProps> = ({
    variant,
    disabled,
    readOnly,
    fillWidth,
    invalid,
    id,
    checked,
    'bind:checked': bindChecked,
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
            type="checkbox"
            checked={checked}
            bind:checked={bindChecked}
            disabled={disabled}
            readonly={readOnly}
            placeholder={placeholder}
            oninput={combineEventHandlers(onInput, oninputFromPassthroughProps)}
            class={[classFromPassthroughProps, classesFromProps, forms.input]}
            {...passthroughProps}
        />
    );
};
