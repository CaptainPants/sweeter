import { descend } from '@captainpants/sweeter-utilities';

import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import { UnknownModelImpl } from './internal/UnknownModelImpl.js';
import { ObjectImpl } from './internal/ObjectImpl.js';
import {
    type UnspecifiedModel,
    type Model,
    UnionModel,
    ElementModelNoConstraint,
    ModelNoConstraint,
    AnyModelConstraint,
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
import { AnyTypeConstraint, UnknownType } from '../type/types.js';
import { ArkErrors, Type, type } from 'arktype';
import { safeParse } from '../utility/parse.js';
import { ValueTypeFromModel } from '../types.js';

export interface CreateModelArgs<TArkType extends AnyTypeConstraint> {
    schema: TArkType; // putting this at the top seems to help with type inference
    value: type.infer<TArkType>;
    parentInfo?: ParentTypeInfo | null | undefined;
    abortSignal?: AbortSignal | undefined;
}

export interface CreateModelPartArgs<
    TArkType extends AnyTypeConstraint,
> {
    schema: TArkType; // putting this at the top seems to help with type inference
    value: type.infer<TArkType>;
    parentInfo: ParentTypeInfo | null | undefined;
    depth?: number;
}

type ModelFactoryMethod<TArkType extends AnyTypeConstraint> = (
    value: type.infer<TArkType>,
    arkType: TArkType,
    parentInfo: ParentTypeInfo | null,
    depth: number,
) => UnspecifiedModel;

type UnknownModelFactoryMethod = (
    value: unknown,
    arkType: AnyTypeConstraint,
    parentInfo: ParentTypeInfo | null,
    depth: number,
) => UnspecifiedModel | undefined;

function failedToParse(type: UnknownType, errors: ArkErrors): never {
    throw new Error(`Failed to parse value as ${type.expression}. ${errors.summary}`);
}

function setup(
    is: (schema: AnyTypeConstraint) => boolean,
    factory: UnknownModelFactoryMethod,
): UnknownModelFactoryMethod {
    return (
        input,
        arkType,
        parentInfo,
        depth,
    ): UnspecifiedModel | undefined => {
        if (!is(arkType)) {
            return undefined;
        }

        const parsed = safeParse(input, arkType);

        if (parsed.success) {
            return factory(parsed.data, arkType, parentInfo, depth);
        }

        failedToParse(arkType, parsed.issues);
    };
}
function setupTyped<TArkType extends AnyTypeConstraint>(
    is: (schema: AnyTypeConstraint) => schema is TArkType,
    factory: ModelFactoryMethod<TArkType>,
): UnknownModelFactoryMethod {
    return (
        input,
        arkType,
        parentInfo,
        depth,
    ): UnspecifiedModel | undefined => {
        if (!is(arkType)) {
            return undefined;
        }

        const parsed = safeParse(input, arkType);

        if (parsed.success) {
            return factory(parsed.data, arkType, parentInfo, depth);
        }

        failedToParse(arkType, parsed.issues);
    };
}

const defaults = [
    setup(isUnionType, function union(value, type, parentInfo, depth) {
        return UnionModelImpl.createFromValue(value, type, parentInfo, depth);
    }),
    setupTyped(isArrayType, function array(value, type, parentInfo, depth) {
        const res = ArrayModelImpl.createFromValue(
            value,
            type,
            parentInfo,
            depth,
        );
        return res;
    }),
    setupTyped(isObjectType, function object(value, type, parentInfo, depth) {
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
    setupTyped(isStringType, function string(value, type, parentInfo, _depth) {
        return new SimpleModelImpl('string', value, type, parentInfo);
    }),
    setupTyped(isNumberType, function number(value, type, parentInfo, _depth) {
        return new SimpleModelImpl('number', value, type, parentInfo);
    }),
    setup(isUnknownType, function unknown(value, type, parentInfo, _depth) {
        return new UnknownModelImpl(value, type, parentInfo);
    }),
];

function createModel<TArkType extends AnyTypeConstraint>(
    args: CreateModelArgs<TArkType>,
): Promise<Model<TArkType>>;
async function createModel<TArkType extends AnyTypeConstraint>({
    value,
    schema,
    parentInfo,
    abortSignal,
}: CreateModelArgs<TArkType>): Promise<Model<TArkType>> {
    const typed = await validateAndThrow(schema, value, { abortSignal });

    return createModelPart<TArkType>({
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
function createModelPart<TArkType extends AnyTypeConstraint>(
    args: CreateModelPartArgs<TArkType>,
): Model<TArkType> {
    // This indirection is mostly so that we don't have 15 'as any' parts,
    // and just have the one 'any' return type
    const { value, schema: type, parentInfo, depth } = args;
    return doCreateModelPart(value, type, parentInfo, depth) as never;
}

function doCreateModelPart<TArkType extends AnyTypeConstraint>(
    value: unknown,
    schema: TArkType,
    parentInfo: ParentTypeInfo | null = null,
    depth = descend.defaultDepth,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): UnspecifiedModel {
    parentInfo ??= null;

    for (const item of defaults) {
        const currentResult = item(value, schema, parentInfo, depth);
        if (currentResult) {
            return currentResult;
        }
    }

    throw new TypeError(`Unrecognised type ${schema.constructor.name}.`);
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
