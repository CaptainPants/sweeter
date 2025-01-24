import {
    $derived,
    $val,
    type Component,
    type IntrinsicElementProps,
    type PropertiesMightBeSignals,
    type ReadWriteSignal,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
    type TypedEvent,
} from '@serpentis/ptolemy-web';

import { combineStyles } from '../../internal/combineStyles.js';
import { type VariantName } from '../../internal/constants.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

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

    id?: string | undefined;

    value?: string | undefined;
    autofocus?: boolean | undefined;
    tabindex?: number | undefined;

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
    tabindex,
    autofocus,
    class: classProp,
    style,
    onInput,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $derived(() => {
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

    const children = $derived(() => {
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
            tabindex={tabindex}
            autofocus={autofocus}
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
