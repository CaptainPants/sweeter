/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type UnknownRigidObjectModel,
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
    type UnknownMapObjectModel,
} from '../index.js';

it('Specific', () => {
    const rigidObject1: TypeExtendsAssert<
        Model<{ test: string }>,
        UnknownRigidObjectModel
    > = true;

    const rigidObject2: TypeExtendsAssert<
        PropertyModel<{ test: string }>,
        UnknownPropertyModel
    > = true;

    const mapObject1: TypeExtendsAssert<
        Model<ReadonlyRecord<string, string>>,
        UnknownMapObjectModel
    > = true;

    const union1: TypeExtendsAssert<
        UnionModel<{ test: string }>,
        UnknownUnionModel
    > = true;
    const union2: TypeExtendsAssert<
        UnionModel<{ test: string } | 1 | string>,
        UnknownUnionModel
    > = true;
});

it('UnknownModel', () => {
    const a1: TypeExtendsAssert<
        Model<{ test: string }>,
        RealUnknownModel
    > = true;
    const a2: TypeExtendsAssert<
        Model<{ test: string }[]>,
        RealUnknownModel
    > = true;
    const a3: TypeExtendsAssert<
        Model<ReadonlyRecord<string, number>>,
        RealUnknownModel
    > = true;
    const a4: TypeExtendsAssert<Model<'test' | 'run'>, UnknownModel> = true;

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
