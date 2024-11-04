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
            z.ZodUnion<
                [
                    z.ZodObject<{ test: z.ZodString }>,
                    z.ZodNumber,
                    z.ZodLiteral<1>,
                ]
            >
        >,
        UnknownUnionModel
    > = true;
});

it('All models conform to UnknownModel', () => {
    const a1: TypeExtendsAssert<
        Model<z.ZodObject<{ test: z.ZodString }>>,
        UnknownModel
    > = true;
    const a2: TypeExtendsAssert<
        Model<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>>,
        UnknownModel
    > = true;

    const a3: TypeExtendsAssert<Model<z.ZodString>, UnknownModel> = true;
    const a4: TypeExtendsAssert<Model<z.ZodNumber>, UnknownModel> = true;
    const a5: TypeExtendsAssert<Model<z.ZodBoolean>, UnknownModel> = true;
    const a6: TypeExtendsAssert<Model<z.ZodUndefined>, UnknownModel> = true;
    const a7: TypeExtendsAssert<Model<z.ZodNull>, UnknownModel> = true;
    const a8: TypeExtendsAssert<
        Model<z.ZodLiteral<'test'>>,
        UnknownModel
    > = true;
    const a9: TypeExtendsAssert<Model<z.ZodLiteral<12>>, UnknownModel> = true;
    const a10: TypeExtendsAssert<
        Model<z.ZodLiteral<true>>,
        UnknownModel
    > = true;
});

type A = z.ZodObject<{ test: z.ZodString }, UnknownKeysParam, z.ZodUnknown>;
type B = z.ZodObject<
    Record<string, z.ZodUnknown>,
    UnknownKeysParam,
    z.ZodUnknown
>;
type ZZZ = Model<z.ZodUnion<[z.ZodAny]>>;

it('All models conform to reasonable less specific models', () => {
    // == I'd like this to work, but it doesn't
    // const object_less_properties: TypeExtendsAssert<
    //     ObjectModel<z.ZodObject<{ test: z.ZodString }>>,
    //     ObjectModel<z.ZodObject<{ }, UnknownKeysParam, z.ZodUnknown>>
    // > = true;

    // Literal values should expand to the base type
    const literal_any: TypeExtendsAssert<
        Model<z.ZodLiteral<'test'>>,
        Model<z.ZodLiteral<any>>
    > = true;
    const literal_string: TypeExtendsAssert<
        Model<z.ZodLiteral<'test'>>,
        Model<z.ZodLiteral<string>>
    > = true;
    const literal_number: TypeExtendsAssert<
        Model<z.ZodLiteral<12>>,
        Model<z.ZodLiteral<number>>
    > = true;
    const literal_boolean: TypeExtendsAssert<
        Model<z.ZodLiteral<true>>,
        Model<z.ZodLiteral<boolean>>
    > = true;
});
