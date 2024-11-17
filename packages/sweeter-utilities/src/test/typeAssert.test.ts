import { typeAssert } from './typeAssert.js';

it('Happy', () => {
    typeAssert.equal<1, 1>();
    typeAssert.equal<'1', '1'>();

    typeAssert.extends<1, number>();
    typeAssert.extends<'a', string>();
});
