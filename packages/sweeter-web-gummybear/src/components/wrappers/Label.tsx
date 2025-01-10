import {
    $derived,
    $val,
    type Component,
    type IntrinsicElementProps,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

import { combineStyles } from '../../internal/combineStyles.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type LabelProps = PropertiesMightBeSignals<{
    children?: JSX.Element | undefined;

    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;

    id?: string | undefined;
    for?: string | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;
}> & {
    passthroughProps?: IntrinsicElementProps<'label'> | undefined;
};

export const Label: Component<LabelProps> = ({
    children,
    id,
    for: forProp,
    disabled = false,
    fillWidth,
    class: classProp,
    style,
    passthroughProps: {
        class: classFromPassthroughProps,
        style: styleFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $derived(() => {
        const result: ElementCssClasses = [];

        applyStandardClasses(result, {
            disabled: $val(disabled),
            fillWidth: $val(fillWidth),
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
