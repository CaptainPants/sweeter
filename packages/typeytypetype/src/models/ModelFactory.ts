import { descend } from '@captainpants/sweeter-utilities';
import { ArrayType } from '../types/ArrayType.js';
import {
    BooleanConstantType,
    MapObjectType,
    NullConstantType,
    NumberConstantType,
    NumberType,
    RigidObjectType,
    StringConstantType,
    StringType,
    type Type,
    UndefinedConstantType,
} from '../types/index.js';
import { UnionType } from '../types/UnionType.js';
import { UnknownType } from '../types/UnknownType.js';

import { ArrayModelImpl } from './internal/ArrayModelImpl.js';
import { SimpleModelImpl } from './internal/SimpleModelImpl.js';
import { UnionModelImpl } from './internal/UnionModelImpl.js';
import { UnknownModelImpl } from './internal/UnknownModelImpl.js';
import { type Model } from './Model.js';
import { type ParentTypeInfo } from './parents.js';
import { RigidObjectImpl } from './internal/RigidObjectImpl.js';
import { MapObjectImpl } from './internal/MapObjectImpl.js';

export interface CreateModelArgs<T> {
    value: unknown;
    type: Type<T>;
    parentInfo?: ParentTypeInfo | null | undefined;
    abortSignal?: AbortSignal | undefined;
}

export interface CreateUnvalidatedModelPartArgs<T> {
    value: T;
    type: Type<T>;
    parentInfo: ParentTypeInfo | null | undefined;
    depth?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types -- Used as a key to identify the actual type of a Definition object
type ConstructorFunction = Function;
type ModelFactoryMethod = (
    value: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Type<any>,
    parentInfo: ParentTypeInfo | null,
    depth: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Model<any>;

const defaults: Array<
    [constructor: ConstructorFunction, factoryMethod: ModelFactoryMethod]
> = [
    [
        UnionType,
        (value, type, parentInfo, depth) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            UnionModelImpl.createFromValue<any>(
                value,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type as UnionType<any>,
                parentInfo,
                depth,
            ),
    ],
    [
        ArrayType,
        (value, type, parentInfo, depth) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ArrayModelImpl.createFromValue<any>(
                value as unknown[],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type as ArrayType<any>,
                parentInfo,
                depth,
            ),
    ],
    [
        RigidObjectType,
        (value, type, parentInfo, depth) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            RigidObjectImpl.createFromValue<any>(
                value,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type as RigidObjectType<any>,
                parentInfo,
                depth,
            ),
    ],
    [
        MapObjectType,
        (value, type, parentInfo, depth) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            MapObjectImpl.createFromValue<any>(
                value as Record<string, unknown>,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type as MapObjectType<any>,
                parentInfo,
                depth,
            ),
    ],
    [
        StringConstantType,
        (value, type, parentInfo, depth) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new SimpleModelImpl<string, StringConstantType<any>>(
                'string-constant',
                value as string,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type as StringConstantType<any>,
                parentInfo,
            ),
    ],
    [
        StringType,
        (value, type, parentInfo, depth) =>
            new SimpleModelImpl<string, StringType>(
                'string',
                value as string,
                type as StringType,
                parentInfo,
            ),
    ],
    [
        NumberConstantType,
        (value, type, parentInfo, depth) =>
            new SimpleModelImpl<number, NumberConstantType<number>>(
                'number-constant',
                value as number,
                type as NumberConstantType<number>,
                parentInfo,
            ),
    ],
    [
        NumberType,
        (value, type, parentInfo, depth) =>
            new SimpleModelImpl<number, NumberType>(
                'number',
                value as number,
                type as NumberType,
                parentInfo,
            ),
    ],
    [
        BooleanConstantType,
        (value, type, parentInfo, depth) => {
            if (value) {
                return new SimpleModelImpl<true, BooleanConstantType<true>>(
                    'boolean-constant',
                    value as true,
                    type as BooleanConstantType<true>,
                    parentInfo,
                );
            } else {
                return new SimpleModelImpl<false, BooleanConstantType<false>>(
                    'boolean-constant',
                    value as false,
                    type as BooleanConstantType<false>,
                    parentInfo,
                );
            }
        },
    ],
    [
        NullConstantType,
        (value, type, parentInfo, depth) =>
            new SimpleModelImpl<null, NullConstantType>(
                'null',
                value as null,
                type as NullConstantType,
                parentInfo,
            ),
    ],
    [
        UndefinedConstantType,
        (value, type, parentInfo, depth) =>
            new SimpleModelImpl<undefined, UndefinedConstantType>(
                'undefined',
                value as undefined,
                type as UndefinedConstantType,
                parentInfo,
            ),
    ],
    [
        UnknownType,
        (value, type, parentInfo, _depth) => {
            return new UnknownModelImpl(
                value,
                type as unknown as UnknownType,
                parentInfo,
            );
        },
    ],
];

const map: WeakMap<ConstructorFunction, ModelFactoryMethod> = new WeakMap<
    ConstructorFunction,
    ModelFactoryMethod
>();

for (const [key, value] of defaults) {
    map.set(key, value);
}

function createModel<T>(args: CreateModelArgs<T>): Promise<Model<T>>;
async function createModel<T>({
    value,
    type,
    parentInfo,
    abortSignal,
}: CreateModelArgs<T>): Promise<Model<T>> {
    const typed = await type.validateAndThrow(value, { abortSignal });

    return createUnvalidatedModelPart<T>({
        value: typed,
        type,
        depth: descend.defaultDepth,
        parentInfo,
    });
}

function createUnvalidatedModelPart<T>(
    args: CreateUnvalidatedModelPartArgs<T>,
): Model<T> {
    // This indirection is mostly so that we don't have 15 'as any' parts,
    // and just have the one 'any' return type
    const { value, type, parentInfo, depth } = args;
    return doCreateModelPart(value, type, parentInfo, depth);
}

function doCreateModelPart<T>(
    value: unknown,
    type: Type<T>,
    parentInfo: ParentTypeInfo | null | undefined,
    depth = descend.defaultDepth,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    const match = map.get(type.constructor);

    if (match === undefined) {
        throw new TypeError(`Unrecognised type ${type.constructor.name}.`);
    }

    return match(value, type, parentInfo ?? null, descend(depth));
}

function createUnvalidatedReplacement<T>(value: T, model: Model<T>): Model<T> {
    return doCreateModelPart(value, model.type as Type<T>, model.parentInfo);
}

export const ModelFactory = {
    createModel,
    createUnvalidatedModelPart,
    createUnvalidatedReplacement,
};
