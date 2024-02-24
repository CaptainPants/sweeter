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
    const a: TypeExtendsAssert<
        Model<{ test: string }>,
        RealUnknownModel
    > = true;
    const b: TypeExtendsAssert<
        Model<{ test: string }[]>,
        RealUnknownModel
    > = true;
    const c: TypeExtendsAssert<
        Model<Record<string, number>>,
        RealUnknownModel
    > = true;
    const d: TypeExtendsAssert<Model<'test' | 'run'>, RealUnknownModel> = true;

    const e: TypeExtendsAssert<Model<string>, RealUnknownModel> = true;
    const f: TypeExtendsAssert<Model<number>, RealUnknownModel> = true;
    const g: TypeExtendsAssert<Model<boolean>, RealUnknownModel> = true;
    const h: TypeExtendsAssert<UndefinedModel, RealUnknownModel> = true;
    const i: TypeExtendsAssert<NullModel, RealUnknownModel> = true;

    const j: TypeExtendsAssert<Model<'test'>, RealUnknownModel> = true;
    const k: TypeExtendsAssert<Model<12>, RealUnknownModel> = true;
    const l: TypeExtendsAssert<Model<true>, RealUnknownModel> = true;
});
