import { type Type } from 'arktype';
import {
    isArrayType,
    isBooleanLiteralType,
    isBooleanType,
    isNullConstant,
    isNumberLiteralType,
    isNumberType,
    isObjectType,
    isStringLiteralType,
    isStringType,
    isUndefinedConstant,
    isUnionType,
} from '../type/introspect/is.js';

import { isModel } from './isModel.js';
import {
    type BooleanConstantModel,
    type NullModel,
    type NumberConstantModel,
    type NumberModel,
    type StringConstantModel,
    type StringModel,
    type UndefinedModel,
    type UnknownModel,
    type UnknownUnionModel,
    type UnknownArrayModel,
    type AnyModelConstraint,
    type BooleanModel,
    type UnknownObjectModel,
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

export function asObject(
    model: AnyModelConstraint,
): UnknownObjectModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isObjectType(model.type) ? (model as any) : undefined;
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

export function asBoolean(model: AnyModelConstraint): BooleanModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isBooleanType(model.type) ? (model as any) : undefined;
}

export function asString(model: AnyModelConstraint): StringModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringType(model.type) ? (model as any) : undefined;
}

export function asNumberLiteral(
    model: AnyModelConstraint,
): NumberConstantModel<Type<number>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberLiteralType(model.type) ? (model as any) : undefined;
}

export function asStringConstant(
    model: AnyModelConstraint,
): StringConstantModel<Type<string>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringLiteralType(model.type) ? (model as any) : undefined;
}

export function asBooleanConstant(
    model: AnyModelConstraint,
): BooleanConstantModel<Type<boolean>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isBooleanLiteralType(model.type) ? (model as any) : undefined;
}

export function asNullConstant(
    model: AnyModelConstraint,
): NullModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNullConstant(model.type) ? (model as any) : undefined;
}

export function asUndefinedConstant(
    model: AnyModelConstraint,
): UndefinedModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUndefinedConstant(model.type) ? (model as any) : undefined;
}

export function asUnknown(model: UnknownModel): UnknownModel {
    return model;
}

export function asConstant(model: UnknownModel): UnknownModel | undefined {
    if (
        isStringLiteralType(model.type) ||
        isNumberLiteralType(model.type) ||
        isBooleanLiteralType(model.type) ||
        isNullConstant(model.type) ||
        isUndefinedConstant(model.type)
    ) {
        return asUnknown(model);
    }
    return undefined;
}
