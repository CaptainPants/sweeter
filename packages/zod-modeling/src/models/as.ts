import { type z } from 'zod';
import {
    isArrayType,
    isBooleanLiteralType,
    isBooleanType,
    isNullType,
    isNumberLiteralType,
    isNumberType,
    isObjectType,
    isStringLiteralType,
    isStringType,
    isUndefinedType,
    isUnionType,
} from '../type/is/is.js';

import { isModel } from './isModel.js';
import {
    type BooleanConstantModel,
    type Model,
    type NullModel,
    type NumberConstantModel,
    type NumberModel,
    type StringConstantModel,
    type StringModel,
    type UndefinedModel,
    type AnyModelConstraint,
    type UnknownUnionModel,
    type UnknownArrayModel,
    type UnknownModel,
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
): NumberConstantModel<z.ZodLiteral<number>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberLiteralType(model.type) ? (model as any) : undefined;
}

export function asStringConstant(
    model: AnyModelConstraint,
): StringConstantModel<z.ZodLiteral<string>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringLiteralType(model.type) ? (model as any) : undefined;
}

export function asBooleanConstant(
    model: AnyModelConstraint,
): BooleanConstantModel<z.ZodLiteral<boolean>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isBooleanLiteralType(model.type) ? (model as any) : undefined;
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
export function asUnknown<TZodType extends z.ZodTypeAny>(
    model: Model<TZodType>,
): UnknownModel;
export function asUnknown(model: unknown): UnknownModel {
    if (isModel(model)) {
        return model;
    } else {
        throw new TypeError(`Provided value was not a model`);
    }
}

export function asConstant(
    model: AnyModelConstraint,
): UnknownModel | undefined {
    if (
        isStringLiteralType(model.type) ||
        isNumberLiteralType(model.type) ||
        isBooleanLiteralType(model.type) ||
        isNullType(model.type) ||
        isUndefinedType(model.type)
    ) {
        return asUnknown(model);
    }
    return undefined;
}
