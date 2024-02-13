import { ArrayType } from './ArrayType.js';
import {
    BooleanConstantType,
    NullConstantType,
    NumberConstantType,
    StringConstantType,
    UndefinedConstantType,
} from './ConstantTypes.js';
import { MapObjectType } from './MapObjectType.js';
import { NumberType } from './NumberType.js';
import { RigidObjectType } from './RigidObjectType.js';
import { StringType } from './StringType.js';
import { type Type } from './Type.js';
import { UnionType } from './UnionType.js';

export function isRigidObjectType(
    type: Type<unknown>,
): type is RigidObjectType<Record<string, unknown>> {
    return type instanceof RigidObjectType;
}

export function isMapObjectType(
    type: Type<unknown>,
): type is MapObjectType<unknown> {
    return type instanceof MapObjectType;
}

export function isArrayType(type: Type<unknown>): type is ArrayType<unknown> {
    return type instanceof ArrayType;
}

export function isUnionType(type: Type<unknown>): type is UnionType<unknown> {
    return type instanceof UnionType;
}

export function isNumberType(type: Type<unknown>): type is NumberType {
    return type instanceof NumberType;
}

export function isStringType(type: Type<unknown>): type is StringType {
    return type instanceof StringType;
}

export function isBooleanType(
    type: Type<unknown>,
): type is UnionType<true | false> {
    if (!isUnionType(type)) {
        return false;
    }

    return type.types.every((x) => isBooleanConstantType(x));
}

export function isNumberConstantType(
    type: Type<unknown>,
): type is NumberConstantType<number> {
    return type instanceof NumberConstantType;
}

export function isStringConstantType(
    type: Type<unknown>,
): type is StringConstantType<string> {
    return type instanceof StringConstantType;
}

export function isBooleanTrueConstantType(
    type: Type<unknown>,
): type is BooleanConstantType<true> {
    return isBooleanConstantType(type) && type.value;
}

export function isBooleanFalseConstantType(
    type: Type<unknown>,
): type is BooleanConstantType<false> {
    return isBooleanConstantType(type) && !type.value;
}

export function isBooleanConstantType(
    type: Type<unknown>,
): type is BooleanConstantType<true> | BooleanConstantType<false> {
    return type instanceof BooleanConstantType;
}

export function isNullType(type: Type<unknown>): type is NullConstantType {
    return type instanceof NullConstantType;
}

export function isUndefinedType(
    type: Type<unknown>,
): type is UndefinedConstantType {
    return type instanceof UndefinedConstantType;
}

export function isConstantType(
    type: Type<unknown>,
): type is
    | StringConstantType<string>
    | NumberConstantType<number>
    | BooleanConstantType<true>
    | BooleanConstantType<false>
    | NullConstantType
    | UndefinedConstantType {
    return (
        isStringConstantType(type) ||
        isNumberConstantType(type) ||
        isBooleanConstantType(type) ||
        isNullType(type) ||
        isUndefinedType(type)
    );
}

export function isStringOrStringConstantType(
    type: Type<unknown>,
): type is StringType | StringConstantType<string> {
    return isStringType(type) || isStringConstantType(type);
}
export function isNumberOrNumberConstantType(
    type: Type<unknown>,
): type is NumberType | NumberConstantType<number> {
    return isNumberType(type) || isNumberConstantType(type);
}
