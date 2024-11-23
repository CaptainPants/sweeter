import { type, Type } from 'arktype';

import { safeParse } from '../../utility/parse.js';
import { type AnyTypeConstraint } from '../AnyTypeConstraint.js';
import { type InterrogableNode } from './types.js';

export function is<TArkType extends AnyTypeConstraint>(
    val: unknown,
    type: TArkType,
): val is type.infer<TArkType> {
    const res = safeParse(val, type);
    return res.success;
}

export function isObjectType(
    schema: AnyTypeConstraint,
): schema is Type<{ readonly [key: string]: unknown }> {
    const typed = schema as any as InterrogableNode;
    return typed.inner.domain?.domain === 'object';
}

export function isArrayType(
    schema: AnyTypeConstraint,
): schema is Type<unknown[]> {
    const typed = schema as any as InterrogableNode;
    return typed.inner.proto?.builtinName === 'Array';
}

export function isUnionType(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return !!typed.inner.union;
}

export function isNumberType(
    schema: AnyTypeConstraint,
): schema is Type<number> {
    const typed = schema as any as InterrogableNode;
    return typed.inner.domain?.domain === 'number';
}

export function isStringType(
    schema: AnyTypeConstraint,
): schema is Type<string> {
    const typed = schema as any as InterrogableNode;
    return typed.inner.domain?.domain === 'string';
}

export function isBooleanType(
    schema: AnyTypeConstraint,
): schema is Type<boolean> {
    const typed = schema as any as InterrogableNode;
    if (typed.inner.union) {
        const branches = typed.inner.union.branches;
        if (branches.length != 2) return false;

        const branch1 = branches[0] as InterrogableNode;
        const branch2 = branches[1] as InterrogableNode;

        const value1 = branch1.inner.unit?.compiledValue;
        const value2 = branch2.inner.unit?.compiledValue;

        return typeof value1 === 'boolean' && typeof value2 === 'boolean' && value1 !== value2;
    }
    return false;
}

export function isNumberLiteralType(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typeof typed.inner.unit?.compiledValue === 'number';
}

export function isStringLiteralType(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typeof typed.inner.unit?.compiledValue === 'string';
}

export function isBooleanLiteralType(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typeof typed.inner.unit?.compiledValue === 'boolean';
}

export function isBooleanTrueLiteral(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typed.inner.unit?.compiledValue === true;
}

export function isBooleanFalseLiteral(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typed.inner.unit?.compiledValue === false;
}

export function isNullConstant(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typed.inner.unit?.compiledValue === null;
}

export function isUndefinedConstant(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    const unit = typed.inner.unit;
    if (unit) {
        return typeof unit.compiledValue === 'undefined';
    }
    return false;
}

export function isLiteralType(schema: AnyTypeConstraint): boolean {
    return (
        isStringLiteralType(schema) ||
        isNumberLiteralType(schema) ||
        isBooleanLiteralType(schema) ||
        isNullConstant(schema) ||
        isUndefinedConstant(schema)
    );
}

export function isStringOrStringLiteralType(
    schema: AnyTypeConstraint,
): schema is Type<string> {
    return isStringType(schema) || isStringLiteralType(schema);
}

export function isNumberOrNumberLiteralType(
    schema: AnyTypeConstraint,
): schema is Type<number> {
    return isNumberType(schema) || isNumberLiteralType(schema);
}

export function isBooleanOrBooleanLiteralType(
    schema: AnyTypeConstraint,
): schema is Type<boolean> {
    return isBooleanType(schema) || isBooleanLiteralType(schema);
}

export function isUnknownType(schema: AnyTypeConstraint): boolean {
    const typed = schema as any as InterrogableNode;
    return typed.isUnknown();
}