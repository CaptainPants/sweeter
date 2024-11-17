import { type IsSameType } from '../utilityTypes/index.js';

export const typeAssert = {
    equal<TFirst, TSecond>(
        ...message: IsSameType<TFirst, TSecond> extends true
            ? []
            : [{ error: 'Types are not equal'; type1: TFirst; type2: TSecond }]
    ): void {},
    extends<TSubType, TExtends>(
        ...message: TSubType extends TExtends
            ? []
            : [
                  {
                      error: 'TSubType does not extend TExtends';
                      subtype: TSubType;
                      extends: TExtends;
                  },
              ]
    ) {},
};
