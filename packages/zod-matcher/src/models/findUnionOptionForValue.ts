import { zodUtilityTypes } from "../utility/zodUtilityTypes.js";

export function findUnionOptionForValue<TZodUnionType extends zodUtilityTypes.ZodAnyUnionType>(
    value: unknown,
    type: TZodUnionType,
): zodUtilityTypes.UnionOptions<TZodUnionType> | null {
    for (const item of type.options) {
        if (item.safeParse(value).success) {
            return item  as zodUtilityTypes.UnionOptions<TZodUnionType>;
        }
    }
    return null;
}
export function findUnionOptionIndexForValue<TZodUnionType extends zodUtilityTypes.ZodAnyUnionType>(
    value: unknown,
    type: TZodUnionType,
): number | undefined {
    let i = 0;
    for (const item of type.options) {
        if (item.safeParse(value).success) {
            return i;
        }
        ++i;
    }
    return undefined;
}