import { type IsSameType } from './IsSameType.js';

export type TypeMatchAssert<T, U> =
    IsSameType<T, U> extends true
        ? true
        : { error: 'Types are not equal'; type1: T; type2: U };
