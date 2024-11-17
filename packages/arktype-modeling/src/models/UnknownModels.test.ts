/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type Model,
    type TypeExtendsAssert,
    type PropertyModel,
    type UnknownPropertyModel,
    type UnionModel,
    type UnknownUnionModel,
    type UnspecifiedModel,
    type NullModel,
    type UndefinedModel,
    type UnknownModel,
    type ReadonlyRecord,
    type ObjectModel,
    type UnknownObjectModel,
    ModelBase,
} from '../index.js';
import { type, Type } from 'arktype';

it('Specific models conform to', () => {
    const rigidObject1: TypeExtendsAssert<
        PropertyModel<Type<{ test: string }>>,
        UnknownPropertyModel
    > = true;

    const mapObject1: TypeExtendsAssert<
        Model<Type<object>>,
        ObjectModel<Type<object>>
    > = true;

    const union1: TypeExtendsAssert<
        UnionModel<
            Type<
                | { test: string }
                | number
                | 1
            >
        >,
        UnknownUnionModel
    > = true;
});

it('All models conform to UnknownModel', () => {
    const a1: TypeExtendsAssert<
        Model<Type<{ test: string }>>,
        UnspecifiedModel
    > = true;
    const a2: TypeExtendsAssert<
        Model<Type<1 | 2>>,
        UnspecifiedModel
    > = true;

    const a3: TypeExtendsAssert<Model<Type<string>>, UnspecifiedModel> = true;
    const a4: TypeExtendsAssert<Model<Type<number>>, UnspecifiedModel> = true;
    const a5: TypeExtendsAssert<Model<Type<boolean>>, UnspecifiedModel> = true;
    const a6: TypeExtendsAssert<Model<Type<undefined>>, UnspecifiedModel> = true;
    const a7: TypeExtendsAssert<Model<Type<null>>, UnspecifiedModel> = true;
    const a8: TypeExtendsAssert<
        Model<Type<'test'>>,
        UnspecifiedModel
    > = true;
    const a9: TypeExtendsAssert<Model<Type<12>>, UnspecifiedModel> = true;
    const a10: TypeExtendsAssert<
        Model<Type<true>>,
        UnspecifiedModel
    > = true;
});

it('All models conform to reasonable less specific models', () => {
    // == I'd like this to work, but it doesn't
    // const object_less_properties: TypeExtendsAssert<
    //     ObjectModel<Type<{ test: string }>>,
    //     ObjectModel<Type<{ [key: string]: string }>>
    // > = true;

    // Literal values should expand to the base type
    const literal_any: TypeExtendsAssert<
        Model<Type<'test'>>,
        Model<Type<any>>
    > = true;
    const literal_string: TypeExtendsAssert<
        Model<Type<'test'>>,
        Model<Type<string>>
    > = true;
    
    const literal_number: TypeExtendsAssert<
        Model<Type<12>>,
        Model<Type<number>>
    > = true;
    const XXX: Model<Type<boolean>> = null! as Model<Type<true>>;
    const literal_boolean: TypeExtendsAssert<
        Model<Type<true>>,
        Model<Type<boolean>>
    > = true;
});
