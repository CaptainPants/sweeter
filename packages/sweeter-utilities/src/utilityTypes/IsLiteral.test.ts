import {
    IsBooleanLiteral,
    IsNumberLiteral,
    IsStringLiteral,
    IsUnion,
    type TypeMatchAssert,
} from '../index.js';

it('IsBooleanLiteral works', () => {
    const _1: TypeMatchAssert<IsBooleanLiteral<true>, true> = true;

    const _2: TypeMatchAssert<IsBooleanLiteral<false>, true> = true;

    const _3: TypeMatchAssert<IsBooleanLiteral<boolean>, false> = true;
});

it('IsStringLiteral works', () => {
    const _1: TypeMatchAssert<IsStringLiteral<'test'>, true> = true;

    const _2: TypeMatchAssert<IsStringLiteral<string>, false> = true;
});

it('IsNumberLiteral works', () => {
    const _1: TypeMatchAssert<IsNumberLiteral<1>, true> = true;

    const _2: TypeMatchAssert<IsNumberLiteral<number>, false> = true;
});
