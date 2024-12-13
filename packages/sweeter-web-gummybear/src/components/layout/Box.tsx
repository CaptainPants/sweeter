import {
    $calc,
    $val,
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { box } from '../../stylesheets/box.js';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';

export type BoxProps = PropertiesMightBeSignals<{
    level?: number | undefined;
    children?: JSX.Element | undefined;

    style?: ElementCssStyles | undefined;
    class?: ElementCssClasses | undefined;
}>;

export function Box(
    { children, level, class: classProp, style }: BoxProps,
    init: ComponentInit,
) {
    const className = $calc(() => {
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
}
