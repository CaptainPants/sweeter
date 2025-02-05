import {
    $derived,
    $val,
    IntrinsicRawElementAttributes,
    mapProps,
    Prop,
    PropertiesAreSignals,
    PropertiesMightBeSignals,
    type Component,
    type IntrinsicElementPropsInput,
    type ReadWriteSignal,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
    type ThreeValueBoolean,
    type TypedEvent,
} from '@serpentis/ptolemy-web';

import { combineEventHandlers } from '../../internal/combineEventHandlers.js';
import { combineStyles } from '../../internal/combineStyles.js';
import { type VariantName } from '../../internal/constants.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'input'>,
    'id'
>;

export type CheckBoxProps = {
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

    'bind:checked'?: ReadWriteSignal<ThreeValueBoolean> | undefined;

    passthrough?: Prop<
        PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined>
    >;
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
CheckBox.propMappings = {
    passthrough: (input) =>
        mapProps<PropertiesAreSignals<OverridableHtmlAttributes | undefined>>(
            undefined,
            input,
        ),
};
