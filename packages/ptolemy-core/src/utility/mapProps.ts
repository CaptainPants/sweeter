import { $wrap } from '../signals/$wrap.js';
import {
    PropertyMap,
    PropertyMapping,
    PropInputFromParam,
    type PropsInputFromParam,
    type PropsOutputFromParam,
} from '../types/index.js';

export function mapProps<TPropParam>(
    mappings: PropertyMap<TPropParam> | undefined,
    props: PropsInputFromParam<TPropParam>,
): PropsOutputFromParam<TPropParam> {
    const output: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
        const mapping = mappings?.[key as keyof PropertyMap<TPropParam>] as
            | PropertyMapping<TPropParam[keyof TPropParam]>
            | undefined;
        if (mapping) {
            const typedValue = value as PropInputFromParam<
                TPropParam[keyof TPropParam]
            >;
            output[key] = mapping(typedValue);
        } else {
            output[key] = $wrap(value);
        }
    }

    return output as PropsOutputFromParam<TPropParam>;
}
