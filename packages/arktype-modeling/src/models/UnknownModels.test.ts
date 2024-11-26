/* eslint-disable @typescript-eslint/no-unused-vars */
import { typeAssert } from '@captainpants/sweeter-utilities';
import {
    type Model,
    type TypeExtendsAssert,
    type PropertyModel,
    type UnknownPropertyModel,
    type UnionModel,
    type UnknownUnionModel,
    type UnspecifiedModel,
    type ObjectModel,
} from '../index.js';
import { Type } from 'arktype';

it('Specific models conform to', () => {
    typeAssert.extends<
        PropertyModel<Type<{ test: string }>>,
        UnknownPropertyModel
    >();

    typeAssert.extends<Model<Type<object>>, ObjectModel<Type<object>>>();

    typeAssert.extends<
        UnionModel<Type<{ test: string } | number | 1>>,
        UnknownUnionModel
    >();
});

it('All models conform to UnknownModel', () => {
    typeAssert.extends<Model<Type<{ test: string }>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<1 | 2>>, UnspecifiedModel>();

    typeAssert.extends<Model<Type<string>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<number>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<boolean>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<undefined>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<null>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<'test'>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<12>>, UnspecifiedModel>();
    typeAssert.extends<Model<Type<true>>, UnspecifiedModel>();
});

it('All models conform to reasonable less specific models', () => {
    // == I'd like this to work, but it doesn't
    // const object_less_properties: TypeExtendsAssert<
    //     ObjectModel<Type<{ test: string }>>,
    //     ObjectModel<Type<{ [key: string]: string }>>
    // > = true;

    // Literal values should expand to the base type
    typeAssert.extends<Model<Type<'test'>>, Model<Type<any>>>();
    typeAssert.extends<Model<Type<'test'>>, Model<Type<string>>>();

    typeAssert.extends<Model<Type<12>>, Model<Type<number>>>();
    typeAssert.extends<Model<Type<true>>, Model<Type<boolean>>>();
});
