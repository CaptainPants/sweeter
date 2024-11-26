import { AnyTypeConstraint } from '../type/types.js';
import { introspect } from '../type/index.js';
import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';
import { safeParse } from '../utility/parse.js';

export function findUnionOptionForValue<
    TUnionArkType extends AnyTypeConstraint,
>(
    value: unknown,
    type: TUnionArkType,
): arkTypeUtilityTypes.UnionOptions<TUnionArkType> | null {
    const options = introspect.getUnionTypeInfo(type).branches;

    for (const item of options) {
        if (safeParse(value, item).success) {
            return item as arkTypeUtilityTypes.UnionOptions<TUnionArkType>;
        }
    }
    return null;
}
export function findUnionOptionIndexForValue<
    TUnionArkType extends AnyTypeConstraint,
>(value: unknown, type: TUnionArkType): number | undefined {
    const options = introspect.getUnionTypeInfo(type).branches;

    let i = 0;
    for (const item of options) {
        if (safeParse(value, item).success) {
            return i;
        }
        ++i;
    }
    return undefined;
}
