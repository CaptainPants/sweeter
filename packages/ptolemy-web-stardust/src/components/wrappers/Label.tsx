import {
    $derived,
    $val,
    type Component,
    type IntrinsicElementPropsInput,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { combineStyles } from '../../internal/combineStyles.js';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type LabelProps = {
    children?: JSX.Element | undefined;

    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;

    id?: string | undefined;
    for?: string | undefined;

    class?: ElementCssClasses | undefined;
    style?: ElementCssStyles | undefined;
} & {
    passthroughProps?: IntrinsicElementPropsInput<'label'> | undefined;
};

export const Label: Component<LabelProps> = ({
    children,
    id,
    for: forProp,
    disabled,
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
