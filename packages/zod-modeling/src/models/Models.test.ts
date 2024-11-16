
import { Type } from 'arktype';
import {
    type ArrayModel,
    type LiteralModel,
    type Model,
    type ObjectModel,
    type TypeMatchAssert,
    type UnionModel,
} from '../index.js';
import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';

it('All model types match expected results', () => {
    const obj: TypeMatchAssert<
        Model<Type<{}>>,
        ObjectModel<Type<{}>>
    > = true;

    const array: TypeMatchAssert<
        Model<Type<string[]>>,
        ArrayModel<Type<string[]>>
    > = true;

    const union: TypeMatchAssert<
        Model<Type<1 | 2>>,
        UnionModel<Type<1 | 2>>
    > = true;

    const literal_number: TypeMatchAssert<
        Model<Type<1>>,
        LiteralModel<Type<1>>
    > = true;

    const literal_string_specific: TypeMatchAssert<
        Model<Type<'text'>>,
        LiteralModel<Type<'text'>>
    > = true;

    const literal_boolean: TypeMatchAssert<
        Model<Type<true>>,
        LiteralModel<Type<true>>
    > = true;
});
