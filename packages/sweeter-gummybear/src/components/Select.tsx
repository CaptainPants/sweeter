import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
    type ReadWriteSignal,
} from '@captainpants/sweeter-core';
import { type VariantName } from '../internal/constants.js';
import { type ElementCssClasses } from '@captainpants/sweeter-web';
import { variants } from '../stylesheets/markers.js';

export interface SelectOption {
    text?: string | undefined;
    value: string;
}

export type SelectProps = PropertiesMightBeSignals<{
    variant?: VariantName | undefined;
    disabled?: boolean | undefined;

    value?: string | undefined;

    options: SelectOption[];
}> & {
    'bind:value'?: ReadWriteSignal<string> | undefined;

    passthrough?: IntrinsicElementProps<'select'> | undefined;
};

export const Select: Component<SelectProps> = ({
    variant,
    disabled = false,
    options,
    value,
    'bind:value': bindValue,
    passthrough: { class: classFromPassthroughProps, ...passthroughProps } = {},
}) => {
    const fromVariantsSignal = $calc(() => {
        const fromVariants: ElementCssClasses = [];

        const resolvedVariant = $val(variant);
        if (resolvedVariant) {
            variants[resolvedVariant];
        }

        return fromVariants;
    });

    const children = $calc(() => {
        const optionsResolved = $val(options);
        return optionsResolved.map((item) => (
            <option value={item.value}>{item.text ?? item.value}</option>
        ));
    });

    return (
        <select
            value={value}
            bind:value={bindValue}
            disabled={disabled}
            class={[classFromPassthroughProps, fromVariantsSignal]}
            {...passthroughProps}
        >
            {children}
        </select>
    );
};
