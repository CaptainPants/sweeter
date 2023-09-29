import { Props, calc } from '../index.js';
import { valueOf } from '../signals/valueOf.js';

export interface ShowProps {
    if: boolean;
    children: () => JSX.Element;
}

/**
 * Dynamic component - display children when condition is true.
 * @param props
 * @returns
 */
export function Show(props: Props<ShowProps>): JSX.Element {
    const showCalculation = (): JSX.Element => {
        if (valueOf(props.if)) {
            return valueOf(props.children)();
        }
        return undefined;
    };

    return calc(showCalculation);
}
