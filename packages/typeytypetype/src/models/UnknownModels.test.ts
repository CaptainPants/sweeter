/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type UnknownRigidObjectModel,
    type Model,
    type TypeExtendsAssert,
    type PropertyModel,
    type UnknownPropertyModel,
    type UnionModel,
    type UnknownUnionModel,
} from '../index.js';

it('General', () => {
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
