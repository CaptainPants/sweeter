import { type IsSameType } from '../utilityTypes/index.js';

export const typeAssert = {
    equal<TFirst, TSecond>(
        ..._args: IsSameType<TFirst, TSecond> extends true
            ? []
            : [error: { message: 'Types are not equal'; type1: TFirst; type2: TSecond }]
    ): void {},
    extends<TSubType, TExtends>(
        ..._args: TSubType extends TExtends
            ? []
            : [error:
                  {
                      message: 'TSubType does not extend TExtends';
                      subtype: TSubType;
                      extends: TExtends;
                  },
              ]
    ) {},
};
