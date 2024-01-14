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
    type ElementCssStyles,
} from '@captainpants/sweeter-web';
import { forms } from '../../index.js';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';
import { combineStyles } from '../../internal/combineStyles.js';

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

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;

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
    class: classProp,
    style,
    passthroughProps: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
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
            class={[classProp, classFromPassthroughProps, classesFromProps, forms.input]}
            style={combineStyles(style, styleFromPassthroughProps)}
            {...passthroughProps}
        />
    );
};
