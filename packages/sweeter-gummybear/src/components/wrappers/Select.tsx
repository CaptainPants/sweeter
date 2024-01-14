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
    type ElementCssStyles,
    type ElementCssClasses,
    type TypedEvent,
} from '@captainpants/sweeter-web';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';
import { forms } from '../../index.js';
import { combineStyles } from '../../internal/combineStyles.js';

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

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;

    options: SelectOption[];

    onInput?: ((evt: TypedEvent<HTMLSelectElement, Event>) => void) | undefined;
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
    class: classProp,
    style,
    onInput,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
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
            class={[
                classProp,
                classFromPassthroughProps,
                classesFromProps,
                forms.select,
            ]}
            style={combineStyles(style, styleFromPassthroughProps)}
            oninput={onInput}
            {...passthroughProps}
        >
            {children}
        </select>
    );
};
