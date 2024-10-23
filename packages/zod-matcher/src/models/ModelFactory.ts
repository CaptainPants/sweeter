import { descend } from '@captainpants/sweeter-utilities';

import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import { UnknownModelImpl } from './internal/UnknownModelImpl.js';
import { UnknownModel, type Model } from './Model.js';
import { type ParentTypeInfo } from './parents.js';
import { RigidObjectImpl } from './internal/RigidObjectImpl.js';
import { ObjectImpl } from './internal/ObjectImpl.js';
import { type ReadonlyRecord } from '../types.js';
import { z } from 'zod';
import { isArrayType, isBooleanLiteralType, isNullLiteralType, isNumberLiteralType, isNumberType, isObjectType, isStringLiteralType, isStringType, isUndefinedLiteralType, isUnionType, isUnknownType } from '../index.js';
import { validateAndThrow } from './validate.js';

export interface CreateModelArgs<TZodType extends z.ZodTypeAny> {
    value: z.infer<TZodType>;
    type: TZodType;
    parentInfo?: ParentTypeInfo | null | undefined;
    abortSignal?: AbortSignal | undefined;
}

export interface CreateUnvalidatedModelPartArgs<T> {
    value: T;
    type: z.ZodType<T>;
    parentInfo: ParentTypeInfo | null | undefined;
    depth?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types -- Used as a key to identify the actual type of a Definition object
type ConstructorFunction = Function;


type ModelFactoryMethod<TZodType extends z.ZodTypeAny> = (
    value: z.infer<TZodType>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: TZodType,
    parentInfo: ParentTypeInfo | null,
    depth: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Model<TZodType>;

type UnknownModelFactoryMethod = (
    value: unknown,
    type: z.ZodTypeAny,
    parentInfo: ParentTypeInfo | null,
    depth: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => UnknownModel | undefined;

function setup<TZodType extends z.ZodTypeAny>(is: (schema: z.ZodTypeAny) => schema is TZodType, factory: ModelFactoryMethod<TZodType>): UnknownModelFactoryMethod {
    return (input, type, parentInfo, depth) => {
        if (!is(type)) {
            return undefined;
        }

        const res = type.safeParse(input);

        if (res.success) {
            return factory(res.data, type, parentInfo, depth);
        }

        return undefined;
    }
}

const defaults = [
    setup(
        isUnionType, 
        (value, type, parentInfo, depth) =>
            UnionModelImpl.createFromValue(
                value,
                type,
                parentInfo,
                depth,
            )
    ),
    setup(
        isArrayType,
        (value, type, parentInfo, depth) => 
            ArrayModelImpl.createFromValue(
                value,
                type,
                parentInfo,
                depth,
            ),
    ),
    setup(
        isObjectType,
        (value, type, parentInfo, depth) =>
            ObjectImpl.createFromValue(
                value,
                type,
                parentInfo,
                depth,
            ),
    ),
    setup(
        isStringLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'string-constant',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isNumberLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'number-constant',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isBooleanLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'boolean-constant',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isNullLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'null',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isUndefinedLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'undefined',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isStringType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'string',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isNumberType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl(
                'number',
                value,
                type,
                parentInfo,
            ),
    ),
    setup(
        isUnknownType,
        (value, type, parentInfo, _depth) => {
            return new UnknownModelImpl(
                value,
                type,
                parentInfo,
            );
        },
    )
]

function createModel<TZodType extends z.ZodTypeAny>(args: CreateModelArgs<TZodType>): Promise<Model<TZodType>>;
async function createModel<TZodType extends z.ZodTypeAny>({
    value,
    type,
    parentInfo,
    abortSignal,
}: CreateModelArgs<TZodType>): Promise<Model<TZodType>> {
    const typed = await validateAndThrow(type, value, { abortSignal });

    return createUnvalidatedModelPart<TZodType>({
        value: typed,
        type,
        depth: descend.defaultDepth,
        parentInfo,
    });
}

function createUnvalidatedModelPart<TZodType extends z.ZodTypeAny>(
    args: CreateUnvalidatedModelPartArgs<TZodType>,
): Model<TZodType> {
    // This indirection is mostly so that we don't have 15 'as any' parts,
    // and just have the one 'any' return type
    const { value, type, parentInfo, depth } = args;
    return doCreateModelPart(value, type, parentInfo, depth);
}

function doCreateModelPart<TZodType extends z.ZodTypeAny>(
    value: unknown,
    type: TZodType,
    parentInfo: ParentTypeInfo | null = null,
    depth = descend.defaultDepth,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    parentInfo ??= null;

    let match: UnknownModel | undefined = undefined;

    for (const item of defaults) {
        const currentResult = item(value, type, parentInfo, depth);
        if (currentResult) {
            match = currentResult;
        }
    }

    throw new TypeError(`Unrecognised type ${type.constructor.name}.`);
}

function createUnvalidatedReplacement<T extends z.ZodTypeAny>(value: z.infer<T>, model: Model<T>): Model<T> {
    return doCreateModelPart(value, model.type, model.parentInfo);
}

export const ModelFactory = {
    createModel,
    createUnvalidatedModelPart,
    createUnvalidatedReplacement,
};
