// https://dev.to/ecyrbe/how-to-unit-test-your-typescript-utility-types-3cnm

export type TypeMatchAssert<T, U> = (<V>() => V extends T ? 1 : 2) extends <
    V,
>() => V extends U ? 1 : 2
    ? true
    : { error: 'Types are not equal'; type1: T; type2: U };

export type TypeExtendsAssert<T, U> = [T] extends [U]
    ? true
    : { error: `Type type1 does not extend type2`; type1: T; type2: U };
