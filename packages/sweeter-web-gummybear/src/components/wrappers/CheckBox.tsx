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
    type ElementCssStyles,
} from '@captainpants/sweeter-web';
import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { forms } from '../../stylesheets/index.js';

export type CheckBoxProps = PropertiesMightBeSignals<{
    variant?: VariantName | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;

    id?: string | undefined;

    checked?: ThreeValueBoolean | undefined;
    autofocus?: boolean | undefined;
    tabindex?: number | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;

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
    autofocus,
    tabindex,
    class: classProp,
    style,
    onInput,
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
            type="checkbox"
            checked={checked}
            bind:checked={bindChecked}
            disabled={disabled}
            readonly={readOnly}
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
