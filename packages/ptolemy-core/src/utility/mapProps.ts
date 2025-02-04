import { $wrap } from '../signals/$wrap.js';
import {
    type PropInputFromParam,
    type PropParamFromRaw,
    type PropsInputFromParam,
    type PropsOutputFromParam,
} from '../types/index.js';
import { PropertyMap } from '../types/internal/utility.js';

export function mapProps<TPropsDef>(
    mappings: PropertyMap<TPropsDef> | undefined,
    props: PropsInputFromParam<TPropsDef>,
): PropsOutputFromParam<TPropsDef> {
    const output: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
        const mapping = mappings?.[key as keyof PropertyMap<TPropsDef>];
        if (mapping) {
            const typedValue = value as PropInputFromParam<
                PropParamFromRaw<TPropsDef[keyof TPropsDef]>
            >;
            output[key] = mapping(typedValue);
        } else {
            output[key] = $wrap(value);
        }
    }

    return output as PropsOutputFromParam<TPropsDef>;
}

