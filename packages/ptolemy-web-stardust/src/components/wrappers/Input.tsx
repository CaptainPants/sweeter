import {
    $derived,
    $val,
    type Component,
    type IntrinsicRawElementAttributes,
    mapProps,
    Prop,
    type PropertiesAreSignals,
    type PropertiesMightBeSignals,
    type ReadWriteSignal,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
    type InputType,
    type TypedEvent,
} from '@serpentis/ptolemy-web';

import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { type VariantName } from '../../internal/constants.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'input'>,
    'id' | 'bind:value'
>;

export type InputProps = {
    type?: InputType | undefined;

    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;

    id?: string | undefined;

    value?: string | undefined;
    placeholder?: string | undefined;
    autofocus?: boolean | undefined;
    tabindex?: number | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;

    onInput?: ((evt: TypedEvent<HTMLInputElement, Event>) => void) | undefined;

    'bind:value'?: Prop<
        ReadWriteSignal<string> | undefined,
        ReadWriteSignal<string> | undefined
    >;

    passthrough?: Prop<
        | PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>
        | undefined,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined> | undefined
    >;
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
    autofocus,
    tabindex,
    onInput,
    class: classProp,
    style,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        oninput: oninputFromPassthroughProps,
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

    return (
        <input
            id={id}
            type={type}
            value={value}
            bind:value={bindValue}
            disabled={disabled}
            readonly={readOnly}
            placeholder={placeholder}
            autofocus={autofocus}
            tabindex={tabindex}
            oninput={combineEventHandlers(onInput, oninputFromPassthroughProps)}
            class={[
                classProp,
                classFromPassthroughProps,
                classesFromProps,
                forms.input,
            ]}
            style={combineStyles(style, styleFromPassthroughProps)}
            {...passthroughProps}
        />
    );
};
Input.propMappings = {
    passthrough: (input) =>
        input
            ? mapProps<
                  PropertiesAreSignals<OverridableHtmlAttributes | undefined>
              >(undefined, input)
            : undefined,
    'bind:value': (input) => input,
};
