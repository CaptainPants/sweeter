import { type z } from 'zod';
import { type IsAny, type ReadonlyRecord } from '../index.js';

import { type ParentTypeInfo } from './parents.js';
import {
    type UnknownPropertyModel,
    type PropertyModel,
} from './PropertyModel.js';
import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';

export interface ModelBase<TValue, TZodType extends z.ZodType<unknown>> {
    readonly value: TValue;
    readonly type: TZodType;
    readonly parentInfo: ParentTypeInfo | null;
    readonly archetype: string;
}

export interface SimpleModel<T, TType extends z.ZodType<unknown>>
    extends ModelBase<T, TType> {
    readonly archetype: string;
}

export interface StringModel extends SimpleModel<string, z.ZodString> {}
export interface NumberModel extends SimpleModel<number, z.ZodNumber> {}
export interface BooleanModel extends SimpleModel<boolean, z.ZodBoolean> {}

// Constants

export interface LiteralModel<
    TZodLiteralType extends z.ZodLiteral<string | number | boolean>,
> extends SimpleModel<z.infer<TZodLiteralType>, TZodLiteralType> {}

export interface StringConstantModel<
    TZodLiteralType extends z.ZodLiteral<string>,
> extends LiteralModel<TZodLiteralType> {}

export interface NumberConstantModel<
    TZodLiteralType extends z.ZodLiteral<number>,
> extends LiteralModel<TZodLiteralType> {}

export interface BooleanConstantModel<
    TZodLiteralType extends z.ZodLiteral<boolean>,
> extends LiteralModel<TZodLiteralType> {}

export interface NullModel extends SimpleModel<null, z.ZodNull> {}

export interface UndefinedModel
    extends SimpleModel<undefined, z.ZodUndefined> {}

export interface UnknownArrayModelMethods {
    unknownGetElementType: () => z.ZodType<unknown>;

    unknownGetElement: (index: number) => UnknownModel | undefined;

    unknownGetElements: () => ReadonlyArray<UnknownModel>;

    unknownSpliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<unknown | UnknownModel>,
        validate?: boolean,
    ) => Promise<this>;

    moveElement: (
        from: number,
        to: number,
        validate?: boolean,
    ) => Promise<this>;
}

export interface UnknownArrayModel
    extends ModelBase<readonly unknown[], z.ZodArray<z.ZodTypeAny>>,
        UnknownArrayModelMethods {}

// eslint-disable-next-line@typescript-eslint/no-explicit-any
export interface ArrayModel<TArrayZodType extends z.ZodArray<any>>
    extends ModelBase<
            readonly arkTypeUtilityTypes.ArrayElementType<TArrayZodType>[],
            z.ZodArray<
                z.ZodType<arkTypeUtilityTypes.ArrayElementType<TArrayZodType>>
            >
        >,
        UnknownArrayModelMethods {
    getElementType: () => arkTypeUtilityTypes.ArrayElementType<TArrayZodType>;

    getElement: (
        index: number,
    ) => Model<arkTypeUtilityTypes.ArrayElementType<TArrayZodType>> | undefined;

    getElements: () => ReadonlyArray<
        Model<arkTypeUtilityTypes.ArrayElementType<TArrayZodType>>
    >;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            | z.infer<arkTypeUtilityTypes.ArrayElementType<TArrayZodType>>
            | Model<arkTypeUtilityTypes.ArrayElementType<TArrayZodType>>
        >,
        validate?: boolean,
    ) => Promise<this>;
}

export type TypedPropertyModelForKey<
    TZodObjectType extends z.AnyZodObject,
    TKey extends arkTypeUtilityTypes.AllPropertyKeys<TZodObjectType>,
> = TKey extends arkTypeUtilityTypes.AllPropertyKeys<TZodObjectType>
    ? PropertyModel<arkTypeUtilityTypes.AllPropertyTypes<TZodObjectType>[TKey]>
    :
          | PropertyModel<
                arkTypeUtilityTypes.CatchallPropertyValueType<TZodObjectType>
            >
          | undefined;

interface UnknownObjectModelMethods {
    unknownGetProperty(key: string): UnknownPropertyModel | undefined;

    unknownSetProperty(
        key: string,
        value: unknown,
        triggerValidation?: boolean,
    ): Promise<this>;

    unknownGetCatchallType(): z.ZodTypeAny;

    unknownSetProperty(
        key: string,
        value: unknown,
        triggerValidation?: boolean,
    ): Promise<this>;

    deleteProperty(key: string, validate?: boolean): Promise<this>;

    moveProperty(from: string, to: string, validate?: boolean): Promise<this>;

    unknownGetProperties(): readonly UnknownPropertyModel[];
}

export interface UnknownObjectModel
    extends ModelBase<ReadonlyRecord<string, unknown>, z.AnyZodObject>,
        UnknownObjectModelMethods {}

export type UnknownMapObjectEntry = readonly [
    name: string,
    model: UnknownPropertyModel,
];

export type MapObjectEntry<TZodType extends z.ZodTypeAny> = readonly [
    name: string,
    model: PropertyModel<TZodType>,
];

export interface ObjectModel<TZodObjectType extends z.AnyZodObject>
    extends ModelBase<z.infer<TZodObjectType>, TZodObjectType>,
        UnknownObjectModelMethods {
    getCatchallType(): arkTypeUtilityTypes.CatchallPropertyValueType<TZodObjectType>;

    getProperty<
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TZodObjectType> & string,
    >(
        key: TKey,
    ): TypedPropertyModelForKey<TZodObjectType, TKey>;

    getProperties(): readonly PropertyModel<
        z.infer<TZodObjectType>[keyof z.infer<TZodObjectType>]
    >[];

    setProperty<TKey extends keyof z.infer<TZodObjectType> & string>(
        key: TKey,
        value: z.infer<TZodObjectType>[TKey],
        triggerValidation?: boolean,
    ): Promise<this>;
}

export interface UnknownUnionModelMethods {
    as: <TTargetZodType extends z.ZodTypeAny>(
        type: TTargetZodType,
    ) => Model<TTargetZodType> | null;

    getDirectlyResolved: () => UnknownModel;

    unknownGetRecursivelyResolved: () => UnknownModel;

    getTypes: () => ReadonlyArray<z.ZodTypeAny>;

    replace: (value: unknown, validate?: boolean) => Promise<this>;
}

export interface UnionModelMethods<
    TZodUnionType extends arkTypeUtilityTypes.ZodAnyUnionType,
> extends UnknownUnionModelMethods {
    getRecursivelyResolved: () => SpreadModel<
        arkTypeUtilityTypes.RecursiveUnionOptions<TZodUnionType>
    >;
}

export interface UnknownUnionModel
    extends ModelBase<unknown, arkTypeUtilityTypes.ZodAnyUnionType>,
        UnknownUnionModelMethods {}

export interface UnionModel<TUnion extends arkTypeUtilityTypes.ZodAnyUnionType>
    extends ModelBase<z.infer<TUnion>, TUnion>,
        UnionModelMethods<TUnion> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpreadModel<T extends z.ZodTypeAny> = T extends any
    ? Model<T>
    : never;

export interface RealUnknownModel extends ModelBase<unknown, z.ZodUnknown> {}

export type UnknownModel =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | StringConstantModel<z.ZodLiteral<string>>
    | NumberModel
    | NumberConstantModel<z.ZodLiteral<number>>
    | BooleanModel
    | BooleanConstantModel<z.ZodLiteral<boolean>>
    | NullModel
    | UndefinedModel
    | RealUnknownModel;

export type AnyModelConstraint =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | StringConstantModel<z.ZodLiteral<string>>
    | NumberModel
    | NumberConstantModel<z.ZodLiteral<number>>
    | BooleanModel
    | BooleanConstantModel<z.ZodLiteral<boolean>>
    | NullModel
    | UndefinedModel
    | RealUnknownModel;

export type Model<TArkType extends Type> = TArkType extends Type
    ? UnknownModel
    : arkTypeUtilityTypes.IsZodTypeAny<TArkType> extends true
      ? UnknownModel
      : TArkType extends arkTypeUtilityTypes.ZodAnyUnionType
        ? UnionModel<TArkType>
        : // eslint-disable-next-line@typescript-eslint/no-explicit-any
          TArkType extends z.ZodArray<any>
          ? ArrayModel<TArkType>
          : TArkType extends z.AnyZodObject
            ? ObjectModel<TArkType>
            : TArkType extends z.ZodLiteral<infer TLiteralType>
              ? IsAny<TLiteralType> extends true
                  ? // eslint-disable-next-line@typescript-eslint/no-explicit-any
                    LiteralModel<z.ZodLiteral<any>>
                  : /* Block distribution by comparing a 1-tuple */ [
                          TLiteralType,
                      ] extends [boolean]
                    ? BooleanConstantModel<z.ZodLiteral<TLiteralType>>
                    : TLiteralType extends string
                      ? StringConstantModel<z.ZodLiteral<TLiteralType>>
                      : TLiteralType extends number
                        ? NumberConstantModel<z.ZodLiteral<TLiteralType>>
                        : never
              : TArkType extends z.ZodString
                ? StringModel
                : TArkType extends z.ZodNumber
                  ? NumberModel
                  : TArkType extends z.ZodBoolean
                    ? BooleanModel
                    : TArkType extends z.ZodNull
                      ? NullModel
                      : TArkType extends z.ZodUndefined
                        ? UndefinedModel
                        : UnknownModel;

export type PropertyModels<TZodObjectType extends z.AnyZodObject> =
    // eslint-disable-next-line@typescript-eslint/no-explicit-any
    TZodObjectType extends z.ZodObject<infer TShape, any, infer TCatchallType>
        ? {
              [Key in keyof TShape]: PropertyModel<TShape[Key]>;
          } & {
              [key: string]: PropertyModel<TCatchallType>;
          }
        : {
              [key: string]: UnknownPropertyModel;
          };
