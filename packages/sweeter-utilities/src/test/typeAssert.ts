import { IsSameType } from "../utilityTypes";

export const typeAssert = {
    equal<TFirst, TSecond>(...message: IsSameType<TFirst, TSecond> extends true ? [] : [{ error: 'Types are not equal', TFirst: TFirst, TSecond: TSecond }]): void {
    },
    extends<TSubType, TExtends>(...message: TSubType extends TExtends ? [] : [{ error: 'TSubType does not extend TExtends', TSubType: TSubType, TExtends: TExtends }]) {
    }
}
