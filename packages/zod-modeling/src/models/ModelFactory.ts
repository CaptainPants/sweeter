import { descend } from '@captainpants/sweeter-utilities';

import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import { UnknownModelImpl } from './internal/UnknownModelImpl.js';
import { ObjectImpl } from './internal/ObjectImpl.js';
import { type UnknownModel, type Model } from './Model.js';
import { type ParentTypeInfo } from './parents.js';
import { type z } from 'zod';
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
import { AnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { Type, type } from 'arktype';
import { safeParse } from '../utility/parse.js';

export interface CreateModelArgs<TArkType extends AnyTypeConstraint> {
    value: type.infer<TArkType>;
    arkType: TArkType;
    parentInfo?: ParentTypeInfo | null | undefined;
    abortSignal?: AbortSignal | undefined;
}

export interface CreateUnvalidatedModelPartArgs<T> {
    value: T;
    arkType: Type<T>;
    parentInfo: ParentTypeInfo | null | undefined;
    depth?: number;
}

type ModelFactoryMethod<TArkType extends AnyTypeConstraint> = (
    value: type.infer<TArkType>,

    arkType: TArkType,
    parentInfo: ParentTypeInfo | null,
    depth: number,
) => Model<TArkType>;

type UnknownModelFactoryMethod = (
    value: unknown,
    arkType: AnyTypeConstraint,
    parentInfo: ParentTypeInfo | null,
    depth: number,
) => UnknownModel | undefined;

function setup(
    is: (schema: AnyTypeConstraint) => boolean,
    factory: ModelFactoryMethod<Type<unknown>>,
): UnknownModelFactoryMethod {
    return (input, arkType, parentInfo, depth) => {
        if (!is(arkType)) {
            return undefined;
        }

        const res = safeParse(input, arkType);

        if (res.success) {
            return factory(res.data, arkType, parentInfo, depth);
        }

        return undefined;
    };
}
function setupTyped<TArkType extends AnyTypeConstraint>(
    is: (schema: AnyTypeConstraint) => schema is TArkType,
    factory: ModelFactoryMethod<TArkType>,
): UnknownModelFactoryMethod {
    return (input, arkType, parentInfo, depth) => {
        if (!is(arkType)) {
            return undefined;
        }

        const res = safeParse(input, arkType);

        if (res.success) {
            return factory(res.data, arkType, parentInfo, depth);
        }

        return undefined;
    };
}

const defaults = [
    setup(isUnionType, (value, type, parentInfo, depth) =>
        UnionModelImpl.createFromValue(value, type, parentInfo, depth),
    ),
    setupTyped(isArrayType, (value, type, parentInfo, depth) =>
        ArrayModelImpl.createFromValue(value, type, parentInfo, depth),
    ),
    setupTyped(isObjectType, (value, type, parentInfo, depth) =>
        ObjectImpl.createFromValue(value, type, parentInfo, depth),
    ),
    setup(
        isStringLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('string-constant', value, type, parentInfo),
    ),
    setup(
        isNumberLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('number-constant', value, type, parentInfo),
    ),
    setup(
        isBooleanLiteralType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('boolean-constant', value, type, parentInfo),
    ),
    setup(
        isNullConstant,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('null', value, type, parentInfo),
    ),
    setup(
        isUndefinedConstant,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('undefined', value, type, parentInfo),
    ),
    setupTyped(
        isStringType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('string', value, type, parentInfo),
    ),
    setupTyped(
        isNumberType,
        (value, type, parentInfo, _depth) =>
            new SimpleModelImpl('number', value, type, parentInfo),
    ),
    setup(isUnknownType, (value, type, parentInfo, _depth) => {
        return new UnknownModelImpl(value, type, parentInfo);
    }),
];

function createModel<TArkType extends AnyTypeConstraint>(
    args: CreateModelArgs<TArkType>,
): Promise<Model<TArkType>>;
async function createModel<TArkType extends AnyTypeConstraint>({
    value,
    arkType,
    parentInfo,
    abortSignal,
}: CreateModelArgs<TArkType>): Promise<Model<TArkType>> {
    const typed = await validateAndThrow(arkType, value, { abortSignal });

    return createUnvalidatedModelPart<TArkType>({
        value: typed,
        arkType: arkType,
        depth: descend.defaultDepth,
        parentInfo,
    });
}

function createUnvalidatedModelPart<TArkType extends AnyTypeConstraint>(
    args: CreateUnvalidatedModelPartArgs<TArkType>,
): Model<TArkType> {
    // This indirection is mostly so that we don't have 15 'as any' parts,
    // and just have the one 'any' return type
    const { value, arkType: type, parentInfo, depth } = args;
    return doCreateModelPart(value, type, parentInfo, depth);
}

function doCreateModelPart<TArkType extends AnyTypeConstraint>(
    value: unknown,
    type: TArkType,
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

function createUnvalidatedReplacement<TArkType extends AnyTypeConstraint>(
    value: type.infer<TArkType>,
    model: Model<TArkType>,
): Model<TArkType> {
    return doCreateModelPart(value, model.type, model.parentInfo);
}

export const ModelFactory = {
    createModel,
    createUnvalidatedModelPart,
    createUnvalidatedReplacement,
};
