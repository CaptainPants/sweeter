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
} from '../metadata/index.js';

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
    type UnknownRigidObjectModel,
    type UnknownUnionModel,
    type UnknownArrayModel,
    type UnknownModel,
} from './Model.js';

export function cast<TToModel extends AnyModelConstraint>(
    model: AnyModelConstraint,
    as: (model: AnyModelConstraint) => TToModel | undefined,
): TToModel {
    const typed = as(model as unknown as AnyModelConstraint);
    if (!typed) {
        throw new TypeError(`Invalid cast using ${as.name}`);
    }
    return typed;
}

export function asUnion(
    model: AnyModelConstraint,
): UnknownUnionModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUnionType(model.type) ? (model as any) : undefined;
}

export function asRigidObject(
    model: AnyModelConstraint,
): UnknownRigidObjectModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isRigidObjectType(model.type) ? (model as any) : undefined;
}

export function asMap(
    model: AnyModelConstraint,
): MapObjectModel<unknown> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isMapObjectType(model.type) ? (model as any) : undefined;
}

export function asArray(
    model: AnyModelConstraint,
): UnknownArrayModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isArrayType(model.type) ? (model as any) : undefined;
}

export function asNumber(model: AnyModelConstraint): NumberModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberType(model.type) ? (model as any) : undefined;
}

export function asBoolean(
    model: AnyModelConstraint,
): UnionModel<true | false> | undefined {
    const isUnion =
        isUnionType(model.type) &&
        model.type.types.every((x) => isBooleanConstantType(x));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUnion ? (model as any) : undefined;
}

export function asString(model: AnyModelConstraint): StringModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringType(model.type) ? (model as any) : undefined;
}

export function asNumberConstant(
    model: AnyModelConstraint,
): NumberConstantModel<number> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberConstantType(model.type) ? (model as any) : undefined;
}

export function asStringConstant(
    model: AnyModelConstraint,
): StringConstantModel<string> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringConstantType(model.type) ? (model as any) : undefined;
}

export function asBooleanConstant(
    model: AnyModelConstraint,
): BooleanConstantModel<boolean> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isBooleanConstantType(model.type) ? (model as any) : undefined;
}

export function asNullConstant(
    model: AnyModelConstraint,
): NullModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNullType(model.type) ? (model as any) : undefined;
}

export function asUndefinedConstant(
    model: AnyModelConstraint,
): UndefinedModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUndefinedType(model.type) ? (model as any) : undefined;
}

/**
 * Slightly ugly overload to allow for unions of model types, and therefore relatively easy access to casting these to other types.
 * @param model
 */

export function asUnknown(model: AnyModelConstraint): UnknownModel;
export function asUnknown<T>(model: Model<T>): UnknownModel;
export function asUnknown(model: unknown): UnknownModel {
    if (isModel(model)) {
        return model;
    } else {
        throw new TypeError(`Provided value was not a model`);
    }
}

export function asConstant(
    model: AnyModelConstraint,
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
