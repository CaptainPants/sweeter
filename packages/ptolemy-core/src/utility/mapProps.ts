import { $wrap } from '../signals/$wrap.js';
import { type PropsInputFromDef } from '../types/index.js';
import { PropertyMapping } from '../types/internal/utility.js';

export function mapProps<TPropsDef>(
    mappings: PropertyMapping<TPropsDef> | undefined,
    props: PropsInputFromDef<TPropsDef>,
): TPropsDef {
    const output: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
        const mapping = mappings?.[key as keyof TPropsDef];
        if (mapping) {
            output[key] = mapping(value);
        } else {
            output[key] = $wrap(value);
        }
    }

    return output as TPropsDef;
}
