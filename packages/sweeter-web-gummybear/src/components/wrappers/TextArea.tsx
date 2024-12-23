import { $derived, $val } from '@captainpants/sweeter-core';
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
    type ElementCssStyles,
} from '@captainpants/sweeter-web';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { forms } from '../../stylesheets/index.js';

export type TextAreaProps = PropertiesMightBeSignals<{
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
    placeholder,
    tabindex,
    autofocus,
    class: classProp,
    style,
    onInput,
    passthroughProps: {
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
