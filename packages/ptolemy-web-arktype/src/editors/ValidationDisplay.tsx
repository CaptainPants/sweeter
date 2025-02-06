import {
    joinSingleValidationResults,
    type ValidationSingleResult,
} from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $val,
    type Component,
} from '@serpentis/ptolemy-core';
import { GlobalCssClass, stylesheet } from '@serpentis/ptolemy-web';

const css = new GlobalCssClass({
    className: 'ValidationDisplay',
    content: () => stylesheet`
        color: red;
    `,
});

export interface ValidationDisplayProps {
    errors: ValidationSingleResult[] | null | undefined;
};

export const ValidationDisplay: Component<ValidationDisplayProps> = (props) => {
    return $derived(() => {
        const errors = $val(props.errors);

        if (!errors) return undefined;

        return <div class={css}>{joinSingleValidationResults(errors)}</div>;
    });
};
