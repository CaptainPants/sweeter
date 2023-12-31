import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
    type ReadWriteSignal,
} from '@captainpants/sweeter-core';
import { type VariantName } from '../../internal/constants.js';
import { type ElementCssClasses } from '@captainpants/sweeter-web';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';
import { forms } from '../../index.js';

export interface SelectOption {
    text?: string | undefined;
    value: string;
    disabled?: boolean;
}

export type SelectProps = PropertiesMightBeSignals<{
    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;

    id?: string;

    value?: string | undefined;

    options: SelectOption[];
}> & {
    'bind:value'?: ReadWriteSignal<string> | undefined;

    passthrough?: IntrinsicElementProps<'select'> | undefined;
};

export const Select: Component<SelectProps> = ({
    variant,
    disabled,
    fillWidth,
    invalid,
    options,
    id,
    value,
    'bind:value': bindValue,
    passthrough: { class: classFromPassthroughProps, ...passthroughProps } = {},
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

    const children = $calc(() => {
        const optionsResolved = $val(options);
        return optionsResolved.map((item) => (
            <option value={item.value} disabled={item.disabled}>
                {item.text ?? item.value}
            </option>
        ));
    });

    return (
        <select
            id={id}
            value={value}
            bind:value={bindValue}
            disabled={disabled}
            class={[classFromPassthroughProps, classesFromProps, forms.select]}
            {...passthroughProps}
        >
            {children}
        </select>
    );
};
