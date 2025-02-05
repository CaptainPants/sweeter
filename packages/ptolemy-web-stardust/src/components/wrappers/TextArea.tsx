import {
    $derived,
    type IntrinsicRawElementAttributes,
    mapProps,
    type Prop,
    type PropertiesAreSignals,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import { type Component, type ReadWriteSignal } from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
    type TypedEvent,
} from '@serpentis/ptolemy-web';

import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { type VariantName } from '../../internal/constants.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'textarea'>,
    'id' | 'bind:value'
>;

export interface TextAreaProps {
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

    onInput?:
        | ((evt: TypedEvent<HTMLTextAreaElement, Event>) => void)
        | undefined;

    'bind:value'?: Prop<
        ReadWriteSignal<string> | undefined,
        ReadWriteSignal<string> | undefined
    >;

    passthrough?: Prop<
        | PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>
        | undefined,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined> | undefined
    >;
}

export const TextArea: Component<TextAreaProps> = ({
    variant,
    disabled,
    readOnly,
    fillWidth,
    invalid,
    id,
    value,
    'bind:value': bindValue,
    placeholder,
    tabindex,
    autofocus,
    class: classProp,
    style,
    onInput,
    passthrough: {
        class: classFromPassthroughProps,
        oninput: oninputFromPassthroughProps,
        style: styleFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $derived(() => {
        const result: ElementCssClasses = [];

        applyStandardClasses(
            result,
            {
                disabled: disabled?.value,
                fillWidth: fillWidth?.value,
                invalid: invalid?.value,
            },
            variant?.value,
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
            placeholder={placeholder}
            tabindex={tabindex}
            autofocus={autofocus}
            oninput={combineEventHandlers(onInput, oninputFromPassthroughProps)}
            class={[
                classesFromProps,
                forms.input,
                classFromPassthroughProps,
                classProp,
            ]}
            style={combineStyles(style, styleFromPassthroughProps)}
            {...passthroughProps}
        />
    );
};
TextArea.propMappings = {
    passthrough: (input) =>
        input
            ? mapProps<
                  PropertiesAreSignals<OverridableHtmlAttributes | undefined>
              >(undefined, input)
            : undefined,
    'bind:value': (input) => input,
};
