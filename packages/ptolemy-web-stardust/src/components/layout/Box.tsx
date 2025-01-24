import {
    $derived,
    $val,
    Component,
    type PropertiesMightBeSignals,
} from '@serpentis/ptolemy-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { box } from '../../stylesheets/box.js';

export type BoxProps = PropertiesMightBeSignals<{
    level?: number | undefined;
    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
}>;

export const Box: Component<BoxProps> = ({
    children,
    level,
    class: classProp,
    style,
}) => {
    const className = $derived(() => {
        const resolvedLevel = $val(level);

        if (
            resolvedLevel === undefined ||
            resolvedLevel < 1 ||
            resolvedLevel > 12
        ) {
            return undefined;
        }

        // number between 1 and 12
        const key = `_${resolvedLevel}` as const;
        return box[key as keyof typeof box];
    });

    return (
        <div class={[className, classProp]} style={style}>
            {children}
        </div>
    );
};
