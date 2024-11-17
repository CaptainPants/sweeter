import { Type } from 'arktype';
import {
    type ArrayModel,
    type LiteralModel,
    type Model,
    type ObjectModel,
    type TypeMatchAssert,
    type UnionModel,
} from '../index.js';
import { typeAssert } from '@captainpants/sweeter-utilities';

it('All model types match expected results', () => {
    typeAssert.equal<Model<Type<{}>>, ObjectModel<Type<{}>>>();

    typeAssert.equal<Model<Type<string[]>>, ArrayModel<Type<string[]>>>();

    typeAssert.equal<Model<Type<1 | 2>>, UnionModel<Type<1 | 2>>>();

    typeAssert.equal<Model<Type<1>>, LiteralModel<Type<1>>>();

    typeAssert.equal<Model<Type<'text'>>, LiteralModel<Type<'text'>>>();

    typeAssert.equal<Model<Type<true>>, LiteralModel<Type<true>>>();
});
