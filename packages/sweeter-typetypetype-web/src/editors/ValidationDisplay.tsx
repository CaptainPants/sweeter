import {
    $calc,
    $val,
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';
import {
    type ValidationSingleResult,
    joinSingleValidationResults,
} from '@captainpants/typeytypetype';

const css = new GlobalCssClass({
    className: 'ValidationDisplay',
    content: () => stylesheet`
        color: red;
    `,
});

export type ValidationDisplayProps = PropertiesMightBeSignals<{
    errors: ValidationSingleResult[] | undefined;
}>;

export function ValidationDisplay(
    props: ValidationDisplayProps,
    init: ComponentInit,
): JSX.Element {
    return $calc(() => {
        const errors = $val(props.errors);

        if (!errors) return undefined;

        return <div class={css}>{joinSingleValidationResults(errors)}</div>;
    });
}
