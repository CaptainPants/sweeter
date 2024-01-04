import {
    type IntrinsicElementProps,
    type Component,
    type PropertiesMightBeSignals,
    $calc,
    $val,
} from '@captainpants/sweeter-core';
import { type ElementCssClasses } from '@captainpants/sweeter-web';
import { tags } from '../../stylesheets/markers.js';
import { forms } from '../../stylesheets/index.js';

export type LabelProps = PropertiesMightBeSignals<{
    children?: JSX.Element | undefined;

    disabled?: boolean | undefined;

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
    passthroughProps: {
        class: classFromPassthroughProps,
        onclick: onclickFromPassthroughProps,
        ...passthroughProps
    } = {},
}) => {
    const classesFromProps = $calc(() => {
        const result: ElementCssClasses = [];

        if ($val(disabled)) {
            result.push(tags.disabled);
        }

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
