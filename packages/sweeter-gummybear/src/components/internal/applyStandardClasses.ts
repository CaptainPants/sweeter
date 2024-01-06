import {
    type ElementCssClasses,
    type GlobalCssClass,
} from '@captainpants/sweeter-web';
import { tags, variants } from '../../stylesheets/markers.js';
import { type VariantName } from '../../internal/constants.js';

export interface StandardClasses {
    outline?: boolean | undefined;
    disabled?: boolean | undefined;
    fillWidth?: boolean | undefined;
    invalid?: boolean | undefined;
}

const map = {
    outline: tags.outline,
    disabled: tags.disabled,
    fillWidth: tags.fillWidth,
    invalid: tags.invalid,
} as const satisfies Record<keyof StandardClasses, GlobalCssClass>;

export function applyStandardClasses(
    result: ElementCssClasses[],
    classes: StandardClasses,
    variant?: VariantName | undefined,
) {
    for (const key of Object.keys(classes) as (keyof StandardClasses)[]) {
        const value = classes[key];
        if (value) {
            result.push(map[key]);
        }
    }

    if (variant) {
        result.push(variants[variant]);
    }
}
