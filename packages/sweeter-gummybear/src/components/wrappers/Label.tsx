import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
} from '@captainpants/sweeter-core';
import { type ElementCssClasses } from '@captainpants/sweeter-web';
import { forms } from '../../stylesheets/index.js';
import { applyStandardClasses } from '../internal/applyStandardClasses.js';

export type LabelProps = PropertiesMightBeSignals<{
    children?: JSX.Element | undefined;

    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;

    id?: string | undefined;
    for?: string | undefined;
}> & {
    passthroughProps?: IntrinsicElementProps<'label'> | undefined;
};

export const Label: Component<LabelProps> = ({
    children,
    id,
    for: forProp,
    disabled = false,
    fillWidth,
    passthroughProps: {
        class: classFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $calc(() => {
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
            class={[classFromPassthroughProps, classesFromProps, forms.label]}
            {...passthroughProps}
        >
            {children}
        </label>
    );
};
