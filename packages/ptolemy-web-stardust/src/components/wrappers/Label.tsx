import {
    $derived,
    type Component,
    type IntrinsicRawElementAttributes,
    mapProps,
    type Prop,
    type PropertiesAreSignals,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { combineStyles } from '../../internal/combineStyles.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

type OverridableHtmlAttributes = Exclude<
    IntrinsicRawElementAttributes<'label'>,
    'id'
>;

export type LabelProps = {
    children?: JSX.Element | undefined;

    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;

    id?: string | undefined;
    for?: string | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;

    passthrough?: Prop<
        | PropertiesMightBeSignals<OverridableHtmlAttributes | undefined>
        | undefined,
        PropertiesAreSignals<OverridableHtmlAttributes | undefined> | undefined
    >;
};

export const Label: Component<LabelProps> = ({
    children,
    id,
    for: forProp,
    disabled,
    fillWidth,
    class: classProp,
    style,
    passthrough: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $derived(() => {
        const result: ElementCssClasses = [];

        applyStandardClasses(result, {
            disabled: disabled?.value ?? false,
            fillWidth: fillWidth?.value ?? false,
        });

        return result;
    });

    return (
        <label
            id={id}
            for={forProp}
            class={[
                classProp,
                classFromPassthroughProps,
                classesFromProps,
                forms.label,
            ]}
            style={combineStyles(style, styleFromPassthroughProps)}
            {...passthroughProps}
        >
            {children}
        </label>
    );
};
Label.propMappings = {
    passthrough: (input) =>
        input
            ? mapProps<
                  PropertiesAreSignals<OverridableHtmlAttributes | undefined>
              >(undefined, input)
            : undefined,
};
