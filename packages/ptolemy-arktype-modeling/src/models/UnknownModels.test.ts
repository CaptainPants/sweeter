import { type Type } from 'arktype';

import { typeAssert } from '@serpentis/ptolemy-utilities';

import {
    type Model,
    type ObjectModel,
    type PropertyModel,
    type UnionModel,
    type UnknownModel,
    type UnknownPropertyModel,
    type UnknownUnionModel,
} from '../index.js';

it('Specific models conform to', () => {
    typeAssert.extends<
        PropertyModel<Type<{ test: string }>>,
        UnknownPropertyModel
    >();

    typeAssert.extends<Model<Type<object>>, ObjectModel<Type<object>>>();

    typeAssert.extends<
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        UnionModel<Type<{ test: string } | number | 1>>,
        UnknownUnionModel
    >();
});

it('All models conform to UnknownModel', () => {
    typeAssert.extends<Model<Type<{ test: string }>>, UnknownModel>();
    typeAssert.extends<Model<Type<1 | 2>>, UnknownModel>();

    typeAssert.extends<Model<Type<string>>, UnknownModel>();
    typeAssert.extends<Model<Type<number>>, UnknownModel>();
    typeAssert.extends<Model<Type<boolean>>, UnknownModel>();
    typeAssert.extends<Model<Type<undefined>>, UnknownModel>();
    typeAssert.extends<Model<Type<null>>, UnknownModel>();
    typeAssert.extends<Model<Type<'test'>>, UnknownModel>();
    typeAssert.extends<Model<Type<12>>, UnknownModel>();
    typeAssert.extends<Model<Type<true>>, UnknownModel>();
});

it('All models conform to reasonable less specific models', () => {
    // == I'd like this to work, but it doesn't
    // const object_less_properties: TypeExtendsAssert<
    //     ObjectModel<Type<{ test: string }>>,
    //     ObjectModel<Type<{ [key: string]: string }>>
    // > = true;

    // Literal values should expand to the base type
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Unit test for any as a base type */
    typeAssert.extends<Model<Type<'test'>>, Model<Type<any>>>();
    typeAssert.extends<Model<Type<'test'>>, Model<Type<string>>>();

    typeAssert.extends<Model<Type<12>>, Model<Type<number>>>();
    typeAssert.extends<Model<Type<true>>, Model<Type<boolean>>>();
});
