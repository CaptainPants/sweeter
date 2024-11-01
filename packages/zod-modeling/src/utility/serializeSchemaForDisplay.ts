import { literal, type z } from 'zod';
import {
    isArrayType,
    isBooleanLiteralType,
    isNullType,
    isNumberLiteralType,
    isObjectType,
    isStringLiteralType,
    isUndefinedType,
    isUnionType,
} from '../type/is/is.js';
import { notFound } from '../notFound.js';

function create<T extends z.ZodType>(
    check: (schema: z.ZodType) => schema is T,
    convert: (schema: T, depth: number) => string,
): (schema: z.ZodType, depth: number) => string | typeof notFound {
    return (schema, depth) => {
        if (check(schema)) {
            return convert(schema, depth);
        }
        return notFound;
    };
}

function objectForDisplay(obj: z.AnyZodObject, depth: number): string {
    const res: string[] = [];

    const shape = obj.shape();
    const keys = Object.keys(shape);

    for (const key of keys) {
        const keySchema = shape[key]!;
        res.push(
            JSON.stringify(key) +
                ':' +
                serializeSchemaForDisplay(keySchema, depth - 1),
        );
    }

    return '{' + res.join(',') + '}';
}

function unionForDisplay<T extends [z.ZodTypeAny, ...z.ZodTypeAny[]]>(
    union: z.ZodUnion<T>,
    depth: number,
): string {
    const res: string[] = [];

    for (const option of union.options) {
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
    create(isNullType, (val) => JSON.stringify(val)),
    create(isUndefinedType, (val) => 'undefined'),
    create(isObjectType, (val, depth) => objectForDisplay(val, deeper(depth))),
    create(
        isArrayType,
        (val, depth) =>
            serializeSchemaForDisplay(val.element, deeper(depth)) + '[]',
    ),
    create(isUnionType, (val, depth) => unionForDisplay(val, deeper(depth))),
];

export function serializeSchemaForDisplay(
    schema: z.ZodType,
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
