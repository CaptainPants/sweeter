import { type type } from 'arktype';

import { descend } from '@captainpants/sweeter-utilities';

import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import { UnknownTypedModelImpl } from './internal/UnknownTypedModelImpl.js';
import { ObjectImpl } from './internal/ObjectImpl.js';
import {
    type UnknownModel,
    type Model,
    type AnyModelConstraint,
} from './Model.js';
import { type ParentTypeInfo } from './parents.js';
import {
    isArrayType,
    isBooleanLiteralType,
    isNullConstant,
    isNumberLiteralType,
    isNumberType,
    isObjectType,
    isStringLiteralType,
    isStringType,
    isUndefinedConstant,
    isUnionType,
    isUnknownType,
} from '../type/introspect/is.js';
import { validateAndThrow } from '../utility/validate.js';
import { type AnyTypeConstraint, type UnknownType } from '../type/types.js';
import { safeParse } from '../utility/parse.js';
import { type ValueTypeFromModel } from '../types.js';

export interface CreateModelArgs<TSchema extends AnyTypeConstraint> {
    schema: TSchema; // putting this at the top seems to help with type inference
    value: type.infer<TSchema>;
    parentInfo?: ParentTypeInfo | null | undefined;
    abortSignal?: AbortSignal | undefined;
}

export interface CreateModelPartArgs<TSchema extends AnyTypeConstraint> {
    schema: TSchema; // putting this at the top seems to help with type inference
    value: type.infer<TSchema>;
    parentInfo: ParentTypeInfo | null | undefined;
    depth?: number;
}

type ModelFactoryMethod<TSchema extends AnyTypeConstraint> = (
    value: type.infer<TSchema>,
    arkType: TSchema,
    parentInfo: ParentTypeInfo | null,
    depth: number,
) => UnknownModel;

type UnknownModelFactoryMethod = (
    value: unknown,
    arkType: AnyTypeConstraint,
    parentInfo: ParentTypeInfo | null,
    depth: number,
) => UnknownModel | undefined;

function setup<TSchema extends AnyTypeConstraint>(
    is: (schema: UnknownType) => schema is TSchema,
    factory: ModelFactoryMethod<TSchema>,
): UnknownModelFactoryMethod;
function setup(
    is: (schema: UnknownType) => boolean,
    factory: UnknownModelFactoryMethod,
): UnknownModelFactoryMethod;
function setup(
    is: (schema: UnknownType) => boolean,
    factory: UnknownModelFactoryMethod,
): UnknownModelFactoryMethod {
    return (input, schema, parentInfo, depth): UnknownModel | undefined => {
        if (!is(schema)) {
            return undefined;
        }

        const parsed = safeParse(input, schema);

        if (parsed.success) {
            return factory(parsed.data, schema, parentInfo, depth);
        }

        throw new Error(
            `Failed to parse value as ${schema.expression}. ${parsed.issues.summary}`,
        );
    };
}

const builtinFactories = [
    setup(isUnionType, function union(value, type, parentInfo, depth) {
        return UnionModelImpl.createFromValue(value, type, parentInfo, depth);
    }),
    setup(isArrayType, function array(value, type, parentInfo, depth) {
        const res = ArrayModelImpl.createFromValue(
            value,
            type,
            parentInfo,
            depth,
        );
        return res;
    }),
    setup(isObjectType, function object(value, type, parentInfo, depth) {
        return ObjectImpl.createFromValue(value, type, parentInfo, depth);
    }),
    setup(
        isStringLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('string-constant', value, type, parentInfo),
    ),
    setup(
        isNumberLiteralType,
        function number_literal(value, type, parentInfo, _depth) {
            return new SimpleModelImpl(
                'number-constant',
                value,
                type,
                parentInfo,
            );
        },
    ),
    setup(
        isBooleanLiteralType,
        function boolean_literal(value, type, parentInfo, _depth) {
            return new SimpleModelImpl(
                'boolean-constant',
                value,
                type,
                parentInfo,
            );
        },
    ),
    setup(
        isNullConstant,
        function null_literal(value, type, parentInfo, _depth) {
            return new SimpleModelImpl('null', value, type, parentInfo);
        },
    ),
    setup(
        isUndefinedConstant,
        function undefined_literal(value, type, parentInfo, _depth) {
            return new SimpleModelImpl('undefined', value, type, parentInfo);
        },
    ),
    setup(isStringType, function string(value, type, parentInfo, _depth) {
        return new SimpleModelImpl('string', value, type, parentInfo);
    }),
    setup(isNumberType, function number(value, type, parentInfo, _depth) {
        return new SimpleModelImpl('number', value, type, parentInfo);
    }),
    setup(isUnknownType, function unknown(value, type, parentInfo, _depth) {
        return new UnknownTypedModelImpl(value, type, parentInfo);
    }),
];

function createModel<TSchema extends AnyTypeConstraint>(
    args: CreateModelArgs<TSchema>,
): Promise<Model<TSchema>>;
async function createModel<TSchema extends AnyTypeConstraint>({
    value,
    schema,
    parentInfo,
    abortSignal,
}: CreateModelArgs<TSchema>): Promise<Model<TSchema>> {
    const typed = await validateAndThrow(schema, value, { abortSignal });

    return createModelPart<TSchema>({
        value: typed,
        schema: schema,
        depth: descend.defaultDepth,
        parentInfo,
    });
}

/**
 * Note that while the value is not validated, it is type necessarily type checked.
 * @param args
 * @returns
 */
function createModelPart<TSchema extends AnyTypeConstraint>(
    args: CreateModelPartArgs<TSchema>,
): Model<TSchema> {
    // This indirection is mostly so that we don't have 15 'as any' parts,
    // and just have the one 'any' return type
    const { value, schema: type, parentInfo, depth } = args;
    return doCreateModelPart(value, type, parentInfo, depth) as never;
}

let count = 0;

function doCreateModelPart<TSchema extends AnyTypeConstraint>(
    value: unknown,
    schema: TSchema,
    parentInfo: ParentTypeInfo | null = null,
    depth = descend.defaultDepth,
): UnknownModel {
    parentInfo ??= null;

    for (const item of builtinFactories) {
        const currentResult = item(value, schema, parentInfo, depth);
        if (currentResult) {
            return currentResult;
        }
    }

    throw new TypeError(`Unrecognised type ${schema.expression}.`);
}

function createReplacement<
    TModel extends AnyModelConstraint,
    TValue extends ValueTypeFromModel<TModel>,
>(value: TValue, model: TModel): TModel {
    const res = doCreateModelPart(value, model.type, model.parentInfo);
    return res as never;
}

export const ModelFactory = {
    createModel,
    createModelPart,
    createReplacement,
};
