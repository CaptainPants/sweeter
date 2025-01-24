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
    type InputType,
    type TypedEvent,
} from '@serpentis/ptolemy-web';

import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { type VariantName } from '../../internal/constants.js';
import { forms } from '../../stylesheets/index.js';
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
    autofocus?: boolean | undefined;
    tabindex?: number | undefined;

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
    autofocus,
    tabindex,
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
