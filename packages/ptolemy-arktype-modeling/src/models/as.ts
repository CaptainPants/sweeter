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

import {
    type AnyModelConstraint,
    type BooleanConstantModel,
    type BooleanModel,
    type NullModel,
    type NumberConstantModel,
    type NumberModel,
    type StringConstantModel,
    type StringModel,
    type UndefinedModel,
    type UnknownArrayModel,
    type UnknownModel,
    type UnknownObjectModel,
    type UnknownUnionModel,
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
    return isUnionType(model.type) ? (model as UnknownUnionModel) : undefined;
}

export function asObject(
    model: AnyModelConstraint,
): UnknownObjectModel | undefined {
    return isObjectType(model.type) ? (model as UnknownObjectModel) : undefined;
}

export function asArray(
    model: AnyModelConstraint,
): UnknownArrayModel | undefined {
    return isArrayType(model.type) ? (model as UnknownArrayModel) : undefined;
}

export function asNumber(model: AnyModelConstraint): NumberModel | undefined {
    return isNumberType(model.type) ? (model as NumberModel) : undefined;
}

export function asBoolean(model: AnyModelConstraint): BooleanModel | undefined {
    return isBooleanType(model.type) ? (model as BooleanModel) : undefined;
}

export function asString(model: AnyModelConstraint): StringModel | undefined {
    return isStringType(model.type) ? (model as StringModel) : undefined;
}

export function asNumberLiteral(
    model: AnyModelConstraint,
): NumberConstantModel<Type<number>> | undefined {
    return isNumberLiteralType(model.type)
        ? (model as NumberConstantModel<Type<number>>)
        : undefined;
}

export function asStringConstant(
    model: AnyModelConstraint,
): StringConstantModel<Type<string>> | undefined {
    return isStringLiteralType(model.type)
        ? (model as StringConstantModel<Type<string>>)
        : undefined;
}

export function asBooleanConstant(
    model: AnyModelConstraint,
): BooleanConstantModel<Type<boolean>> | undefined {
    return isBooleanLiteralType(model.type)
        ? (model as BooleanConstantModel<Type<boolean>>)
        : undefined;
}

export function asNullConstant(
    model: AnyModelConstraint,
): NullModel | undefined {
    return isNullConstant(model.type) ? (model as NullModel) : undefined;
}

export function asUndefinedConstant(
    model: AnyModelConstraint,
): UndefinedModel | undefined {
    return isUndefinedConstant(model.type)
        ? (model as UndefinedModel)
        : undefined;
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
