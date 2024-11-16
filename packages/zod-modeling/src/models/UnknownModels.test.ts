/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type Model,
    type TypeExtendsAssert,
    type PropertyModel,
    type UnknownPropertyModel,
    type UnionModel,
    type UnknownUnionModel,
    type UnknownModel,
    type NullModel,
    type UndefinedModel,
    type RealUnknownModel,
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
        UnknownObjectModel
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
        UnknownModel
    > = true;
    const a2: TypeExtendsAssert<
        Model<Type<1 | 2>>,
        UnknownModel
    > = true;

    const a3: TypeExtendsAssert<Model<Type<string>>, UnknownModel> = true;
    const a4: TypeExtendsAssert<Model<Type<number>>, UnknownModel> = true;
    const a5: TypeExtendsAssert<Model<Type<boolean>>, UnknownModel> = true;
    const a6: TypeExtendsAssert<Model<Type<undefined>>, UnknownModel> = true;
    const a7: TypeExtendsAssert<Model<Type<null>>, UnknownModel> = true;
    const a8: TypeExtendsAssert<
        Model<Type<'test'>>,
        UnknownModel
    > = true;
    const a9: TypeExtendsAssert<Model<Type<12>>, UnknownModel> = true;
    const a10: TypeExtendsAssert<
        Model<Type<true>>,
        UnknownModel
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
