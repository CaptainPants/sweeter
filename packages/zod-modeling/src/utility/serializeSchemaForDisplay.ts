import { literal, type z } from 'zod';
import {
    isArrayType,
    isBooleanLiteralType,
    isNullConstant,
    isNumberLiteralType,
    isObjectType,
    isStringLiteralType,
    isUndefinedConstant,
    isUnionType,
} from '../type/is/is.js';
import { notFound } from '../notFound.js';
import { arkTypeUtilityTypes } from './arkTypeUtilityTypes.js';
import { UnionType } from '../type/UnionType.js';
import { Type } from 'arktype';

function create<TCheckedArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
    check: (schema: arkTypeUtilityTypes.AnyTypeConstraint) => schema is TCheckedArkType,
    convert: (schema: TCheckedArkType, depth: number) => string,
): (schema: arkTypeUtilityTypes.AnyTypeConstraint, depth: number) => string | typeof notFound {
    return (schema, depth) => {
        if (check(schema)) {
            return convert(schema, depth);
        }
        return notFound;
    };
}

function objectForDisplay(obj: Type<{ readonly [key: string]: unknown }>, depth: number): string {
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

function unionForDisplay<T>(
    union: UnionType<T>,
    depth: number,
): string {
    const res: string[] = [];

    for (const option of union.branchGroups) {
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
    create(isUndefinedConstant, (val) => 'undefined'),
    create(isObjectType, (val, depth) => objectForDisplay(val, deeper(depth))),
    create(
        isArrayType,
        (val, depth) =>
            serializeSchemaForDisplay(val.element, deeper(depth)) + '[]',
    ),
    create(isUnionType, (val, depth) => unionForDisplay(val, deeper(depth))),
];

export function serializeSchemaForDisplay(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
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
