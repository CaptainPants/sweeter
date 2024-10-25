/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
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
    ObjectModel,
    UnknownObjectModel,
} from '../index.js';

it('Specific', () => {
    const rigidObject1: TypeExtendsAssert<
        Model<z.ZodObject<{ test: z.ZodString }>>,
        ObjectModel<z.ZodObject<{ test: z.ZodString }>>
    > = true;

    const rigidObject2: TypeExtendsAssert<
        PropertyModel<z.ZodObject<{ test: z.ZodString }>>,
        UnknownPropertyModel
    > = true;

    const mapObject1: TypeExtendsAssert<
        Model<z.ZodObject<{ }, 'strict', z.ZodUnknown>>,
        UnknownObjectModel
    > = true;

    const union1: TypeExtendsAssert<
        UnionModel<z.ZodUnion<[z.ZodObject<{ test: z.ZodString }>, z.ZodNumber, z.ZodLiteral<1>]>>,
        UnknownUnionModel
    > = true;
});

it('UnknownModel', () => {
    const a1: TypeExtendsAssert<
        Model<z.ZodObject<{ test: z.ZodString }>>,
        UnknownModel
    > = true;
    const a2: TypeExtendsAssert<
        Model<z.ZodUnion<[z.ZodLiteral<'test'>, z.ZodLiteral<'run'>]>>, 
        UnknownModel
    > = true;

    const b1: TypeExtendsAssert<Model<{ test: string }>, UnknownModel> = true;
    const b2: TypeExtendsAssert<Model<{ test: string }[]>, UnknownModel> = true;
    const b3: TypeExtendsAssert<
        Model<ReadonlyRecord<string, number>>,
        UnknownModel
    > = true;
    const b4: TypeExtendsAssert<Model<'test' | 'run'>, RealUnknownModel> = true;

    const c1: TypeExtendsAssert<Model<string>, RealUnknownModel> = true;
    const c2: TypeExtendsAssert<Model<number>, RealUnknownModel> = true;
    const c3: TypeExtendsAssert<Model<boolean>, RealUnknownModel> = true;
    const c4: TypeExtendsAssert<UndefinedModel, RealUnknownModel> = true;
    const c5: TypeExtendsAssert<NullModel, RealUnknownModel> = true;
    const c6: TypeExtendsAssert<Model<'test'>, RealUnknownModel> = true;
    const c7: TypeExtendsAssert<Model<12>, RealUnknownModel> = true;
    const c8: TypeExtendsAssert<Model<true>, RealUnknownModel> = true;

    const d1: TypeExtendsAssert<Model<string>, UnknownModel> = true;
    const d2: TypeExtendsAssert<Model<number>, UnknownModel> = true;
    const d3: TypeExtendsAssert<Model<boolean>, UnknownModel> = true;
    const d4: TypeExtendsAssert<UndefinedModel, UnknownModel> = true;
    const d5: TypeExtendsAssert<NullModel, UnknownModel> = true;
    const d6: TypeExtendsAssert<Model<'test'>, UnknownModel> = true;
    const d7: TypeExtendsAssert<Model<12>, UnknownModel> = true;
    const d8: TypeExtendsAssert<Model<true>, UnknownModel> = true;
});
