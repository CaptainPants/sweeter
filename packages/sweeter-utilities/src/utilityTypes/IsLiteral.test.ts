import {
    type IsBooleanLiteral,
    type IsNumberLiteral,
    type IsStringLiteral,
    typeAssert,
} from '../index.js';

it('IsBooleanLiteral works', () => {
    typeAssert.extends<IsBooleanLiteral<true>, true>();

    typeAssert.extends<IsBooleanLiteral<false>, true>();

    typeAssert.extends<IsBooleanLiteral<boolean>, false>();
});

it('IsStringLiteral works', () => {
    typeAssert.extends<IsStringLiteral<'test'>, true>();

    typeAssert.extends<IsStringLiteral<string>, false>();
});

it('IsNumberLiteral works', () => {
    typeAssert.extends<IsNumberLiteral<1>, true>();

    typeAssert.extends<IsNumberLiteral<number>, false>();
});
