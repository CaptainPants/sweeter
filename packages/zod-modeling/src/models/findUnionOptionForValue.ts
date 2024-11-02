import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';

export function findUnionOptionForValue<
    TZodUnionType extends arkTypeUtilityTypes.ZodAnyUnionType,
>(
    value: unknown,
    type: TZodUnionType,
): arkTypeUtilityTypes.UnionOptions<TZodUnionType> | null {
    for (const item of type.options) {
        if (item.safeParse(value).success) {
            return item as arkTypeUtilityTypes.UnionOptions<TZodUnionType>;
        }
    }
    return null;
}
export function findUnionOptionIndexForValue<
    TZodUnionType extends arkTypeUtilityTypes.ZodAnyUnionType,
>(value: unknown, type: TZodUnionType): number | undefined {
    let i = 0;
    for (const item of type.options) {
        if (item.safeParse(value).success) {
            return i;
        }
        ++i;
    }
    return undefined;
}
