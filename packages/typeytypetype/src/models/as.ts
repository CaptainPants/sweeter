import {
    isArrayType,
    isBooleanConstantType,
    isMapObjectType,
    isNullType,
    isNumberConstantType,
    isNumberType,
    isRigidObjectType,
    isStringConstantType,
    isStringType,
    isUndefinedType,
    isUnionType,
} from '../types/index.js';

import { isModel } from './isModel.js';
import {
    type MapObjectModel,
    type BooleanConstantModel,
    type Model,
    type NullModel,
    type NumberConstantModel,
    type NumberModel,
    type StringConstantModel,
    type StringModel,
    type UndefinedModel,
    type UnionModel,
    type AnyModelConstraint,
    type RealUnknownModel,
    type UnknownRigidObjectModel,
    type UnknownUnionModel,
    type UnknownArrayModel,
} from './Model.js';

export function cast<
    TToModel extends AnyModelConstraint,
    TFromModel extends AnyModelConstraint,
>(
    model: TFromModel,
    as: (model: TFromModel) => TToModel | undefined,
): TToModel {
    const typed = as(model as unknown as TFromModel);
    if (!typed) {
        throw new TypeError(`Invalid cast using ${as.name}`);
    }
    return typed;
}

export function asUnion<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): UnknownUnionModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUnionType(model.type) ? (model as any) : undefined;
}

export function asRigidObject<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): UnknownRigidObjectModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isRigidObjectType(model.type) ? (model as any) : undefined;
}

export function asMap<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): MapObjectModel<unknown> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isMapObjectType(model.type) ? (model as any) : undefined;
}

export function asArray<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): UnknownArrayModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isArrayType(model.type) ? (model as any) : undefined;
}

export function asNumber<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): NumberModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberType(model.type) ? (model as any) : undefined;
}

export function asBoolean<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): UnionModel<true | false> | undefined {
    const isUnion =
        isUnionType(model.type) &&
        model.type.types.every((x) => isBooleanConstantType(x));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUnion ? (model as any) : undefined;
}

export function asString<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): StringModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringType(model.type) ? (model as any) : undefined;
}

export function asNumberConstant<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): NumberConstantModel<number> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberConstantType(model.type) ? (model as any) : undefined;
}

export function asStringConstant<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): StringConstantModel<string> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringConstantType(model.type) ? (model as any) : undefined;
}

export function asBooleanConstant<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): BooleanConstantModel<boolean> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isBooleanConstantType(model.type) ? (model as any) : undefined;
}

export function asNullConstant<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): NullModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNullType(model.type) ? (model as any) : undefined;
}

export function asUndefinedConstant<TFromModel extends AnyModelConstraint>(
    model: TFromModel,
): UndefinedModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUndefinedType(model.type) ? (model as any) : undefined;
}

/**
 * Slightly ugly overload to allow for unions of model types, and therefore relatively easy access to casting these to other types.
 * @param model
 */

export function asUnknown<TModel extends AnyModelConstraint>(
    model: TModel,
): RealUnknownModel;
export function asUnknown<T>(model: Model<T>): RealUnknownModel;
export function asUnknown(model: unknown): RealUnknownModel {
    if (isModel(model)) {
        return model;
    } else {
        throw new TypeError(`Provided value was not a model`);
    }
}

export function asConstant<TFrom>(
    model: Model<TFrom>,
): Model<unknown> | undefined {
    if (
        isStringConstantType(model.type) ||
        isNumberConstantType(model.type) ||
        isBooleanConstantType(model.type) ||
        isNullType(model.type) ||
        isUndefinedType(model.type)
    ) {
        return asUnknown(model);
    }
    return undefined;
}
