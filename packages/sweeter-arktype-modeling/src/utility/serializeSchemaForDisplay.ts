import { type Type } from 'arktype';

import { notFound } from '../notFound.js';
import { getArrayTypeInfo } from '../type/introspect/getArrayTypeInfo.js';
import { getUnionTypeInfo } from '../type/introspect/getUnionTypeInfo.js';
import {
    isArrayType,
    isBooleanLiteralType,
    isNullConstant,
    isNumberLiteralType,
    isObjectType,
    isStringLiteralType,
    isUndefinedConstant,
    isUnionType,
} from '../type/introspect/is.js';
import { type AnyTypeConstraint,type UnknownType } from '../type/types.js';

function createTyped<TCheckedSchema extends AnyTypeConstraint>(
    check: (schema: UnknownType) => schema is TCheckedSchema,
    convert: (schema: TCheckedSchema, depth: number) => string,
): (schema: UnknownType, depth: number) => string | typeof notFound {
    return (schema, depth) => {
        if (check(schema)) {
            return convert(schema, depth);
        }
        return notFound;
    };
}

function create(
    check: (schema: UnknownType) => boolean,
    convert: (schema: UnknownType, depth: number) => string,
): (schema: UnknownType, depth: number) => string | typeof notFound {
    return (schema, depth) => {
        if (check(schema)) {
            return convert(schema, depth);
        }
        return notFound;
    };
}

function objectForDisplay(
    obj: Type<{ readonly [key: string]: unknown }>,
    depth: number,
): string {
    const res: string[] = [];

    for (const { key, value: propType } of obj.props) {
        res.push(
            JSON.stringify(key) +
                ':' +
                serializeSchemaForDisplay(propType, depth - 1),
        );
    }

    return '{' + res.join(',') + '}';
}

function unionForDisplay(union: UnknownType, depth: number): string {
    const res: string[] = [];

    const { branches } = getUnionTypeInfo(union);

    for (const option of branches) {
        res.push(serializeSchemaForDisplay(option, deeper(depth)));
    }

    return res.join('|');
}

function deeper(depth: number) {
    if (depth == 0) {
        throw new Error('Depth limit exceeded.');
    }
    return depth - 1;
}

const convertors = [
    create(isStringLiteralType, (val) => JSON.stringify(val)),
    create(isNumberLiteralType, (val) => JSON.stringify(val)),
    create(isBooleanLiteralType, (val) => JSON.stringify(val)),
    create(isNullConstant, (val) => JSON.stringify(val)),
    create(isUndefinedConstant, () => 'undefined'),
    createTyped(isObjectType, (val, depth) =>
        objectForDisplay(val, deeper(depth)),
    ),
    createTyped(
        isArrayType,
        (val, depth) =>
            serializeSchemaForDisplay(
                getArrayTypeInfo(val).elementType,
                deeper(depth),
            ) + '[]',
    ),
    create(isUnionType, (val, depth) => unionForDisplay(val, deeper(depth))),
];

export function serializeSchemaForDisplay(
    schema: UnknownType,
    depthLimit: number = 20,
): string {
    for (const convertor of convertors) {
        const res = convertor(schema, depthLimit);
        if (res != notFound) {
            return res;
        }
    }

    throw new Error('No convertor found.');
}
