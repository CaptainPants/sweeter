import {
    joinSingleValidationResults,
    type ValidationSingleResult,
} from '@captainpants/sweeter-arktype-modeling';
import {
    $derived,
    $val,
    Component,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { GlobalCssClass, stylesheet } from '@captainpants/sweeter-web';

const css = new GlobalCssClass({
    className: 'ValidationDisplay',
    content: () => stylesheet`
        color: red;
    `,
});

export type ValidationDisplayProps = PropertiesMightBeSignals<{
    errors: ValidationSingleResult[] | null | undefined;
}>;

export const ValidationDisplay: Component<ValidationDisplayProps> = (props) => {
    return $derived(() => {
        const errors = $val(props.errors);

        if (!errors) return undefined;

        return <div class={css}>{joinSingleValidationResults(errors)}</div>;
    });
};
