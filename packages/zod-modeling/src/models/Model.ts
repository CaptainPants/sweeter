import { type z } from 'zod';
import { AnyTypeConstraint, type IsAny, type ReadonlyRecord } from '../index.js';

import { type ParentTypeInfo } from './parents.js';
import {
    type UnknownPropertyModel,
    type PropertyModel,
} from './PropertyModel.js';
import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';
import { type, Type } from 'arktype';
import { IsUnion } from '@captainpants/sweeter-utilities';

export interface ModelBase<TValue, TArkType extends AnyTypeConstraint> {
    readonly value: TValue;
    readonly type: TArkType;
    readonly parentInfo: ParentTypeInfo | null;
    readonly archetype: string;
}

export interface SimpleModel<T, TArkType extends AnyTypeConstraint>
    extends ModelBase<T, TArkType> {
    readonly archetype: string;
}

export interface StringModel extends SimpleModel<string, Type<string>> {}
export interface NumberModel extends SimpleModel<number, Type<string>> {}
export interface BooleanModel extends SimpleModel<boolean, Type<string>> {}

// Constants

export interface LiteralModel<
    TArkType extends Type<string | number | boolean | null | undefined>,
> extends SimpleModel<type.infer<TArkType>, TArkType> {}

export interface StringConstantModel<
    TLiteralArkType extends Type<string>,
> extends LiteralModel<TLiteralArkType> {}

export interface NumberConstantModel<
    TLiteralArkType extends Type<number>,
> extends LiteralModel<TLiteralArkType> {}

export interface BooleanConstantModel<
    TLiteralArkType extends Type<boolean>,
> extends LiteralModel<TLiteralArkType> {}

export interface NullModel extends LiteralModel<Type<null>> {}

export interface UndefinedModel
    extends LiteralModel<Type<undefined>> {}

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
    extends ModelBase<readonly unknown[], Type<unknown[]>>,
        UnknownArrayModelMethods {}
``
// eslint-disable-next-line@typescript-eslint/no-explicit-any
export interface ArrayModel<TArrayArkType extends Type<unknown[]>>
    extends ModelBase<
            type.infer<TArrayArkType>,
            TArrayArkType
        >,
        UnknownArrayModelMethods {
    getElementType: () => arkTypeUtilityTypes.ArrayElementType<TArrayArkType>;

    getElement: (
        index: number,
    ) => Model<arkTypeUtilityTypes.ArrayElementType<TArrayArkType>> | undefined;

    getElements: () => ReadonlyArray<
        Model<arkTypeUtilityTypes.ArrayElementType<TArrayArkType>>
    >;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            | type.infer<arkTypeUtilityTypes.ArrayElementType<TArrayArkType>>
            | Model<arkTypeUtilityTypes.ArrayElementType<TArrayArkType>>
        >,
        validate?: boolean,
    ) => Promise<this>;
}

export type TypedPropertyModelForKey<
    TArkObjectType extends AnyTypeConstraint,
    TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType>,
> = TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType>
    ? PropertyModel<arkTypeUtilityTypes.AllPropertyTypes<TArkObjectType>[TKey]>
    :
          | PropertyModel<
                arkTypeUtilityTypes.CatchallPropertyValueType<TArkObjectType>
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
    extends ModelBase<ReadonlyRecord<string, unknown>, AnyTypeConstraint>,
        UnknownObjectModelMethods {}

export type UnknownMapObjectEntry = readonly [
    name: string,
    model: UnknownPropertyModel,
];

export type MapObjectEntry<TArkType extends AnyTypeConstraint> = readonly [
    name: string,
    model: PropertyModel<TArkType>,
];

export interface ObjectModel<TArkObjectType extends AnyTypeConstraint>
    extends ModelBase<type.infer<TArkObjectType>, TArkObjectType>,
        UnknownObjectModelMethods {
    getCatchallType(): arkTypeUtilityTypes.CatchallPropertyValueType<TArkObjectType>;

    getProperty<
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType> & string,
    >(
        key: TKey,
    ): TypedPropertyModelForKey<TArkObjectType, TKey>;

    getProperties(): readonly PropertyModel<
        type.infer<TArkObjectType>[keyof type.infer<TArkObjectType>]
    >[];

    setProperty<TKey extends keyof type.infer<TArkObjectType> & string>(
        key: TKey,
        value: type.infer<TArkObjectType>[TKey],
        triggerValidation?: boolean,
    ): Promise<this>;
}

export interface UnknownUnionModelMethods {
    as: <TTargetArkType extends z.ZodTypeAny>(
        type: TTargetArkType,
    ) => Model<TTargetArkType> | null;

    getDirectlyResolved: () => UnknownModel;

    unknownGetRecursivelyResolved: () => UnknownModel;

    getTypes: () => ReadonlyArray<z.ZodTypeAny>;

    replace: (value: unknown, validate?: boolean) => Promise<this>;
}

export interface UnionModelMethods<
    TZodUnionType extends AnyTypeConstraint,
> extends UnknownUnionModelMethods {
    getRecursivelyResolved: () => SpreadModel<
        arkTypeUtilityTypes.RecursiveUnionOptions<TZodUnionType>
    >;
}

export interface UnknownUnionModel
    extends ModelBase<unknown, Type<unknown>>,
        UnknownUnionModelMethods {}

export interface UnionModel<TUnion extends AnyTypeConstraint>
    extends ModelBase<type.infer<TUnion>, TUnion>,
        UnionModelMethods<TUnion> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpreadModel<T extends AnyTypeConstraint> = T extends any
    ? Model<T>
    : never;

export interface RealUnknownModel extends ModelBase<unknown, Type<unknown>> {}

export type UnknownModel =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | StringConstantModel<Type<string>>
    | NumberModel
    | NumberConstantModel<Type<number>>
    | BooleanModel
    | BooleanConstantModel<Type<boolean>>
    | NullModel
    | UndefinedModel
    | RealUnknownModel;

export type AnyModelConstraint =
    | UnknownArrayModel
    | UnknownObjectModel
    | UnknownUnionModel
    | StringModel
    | StringConstantModel<Type<string>>
    | NumberModel
    | NumberConstantModel<Type<number>>
    | BooleanModel
    | BooleanConstantModel<Type<boolean>>
    | NullModel
    | UndefinedModel
    | RealUnknownModel;

export type Model<TArkType extends Type> = TArkType extends Type<unknown>
    ? IsUnion<type.infer<TArkType>> extends true
      ? UnionModel<TArkType>
        : // eslint-disable-next-line@typescript-eslint/no-explicit-any
          TArkType extends Type<unknown[]>
          ? ArrayModel<TArkType>
          : TArkType extends z.AnyZodObject
            ? ObjectModel<TArkType>
            : TArkType extends z.ZodLiteral<infer TLiteralType>
              ? IsAny<TLiteralType> extends true
                  ? // eslint-disable-next-line@typescript-eslint/no-explicit-any
                    LiteralModel<Type<any>>
                  : /* Block distribution by comparing a 1-tuple */ [
                          TLiteralType,
                      ] extends [boolean]
                    ? BooleanConstantModel<Type<TLiteralType>>
                    : TLiteralType extends string
                      ? StringConstantModel<Type<TLiteralType>>
                      : TLiteralType extends number
                        ? NumberConstantModel<Type<TLiteralType>>
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
                        : UnknownModel
    : never;

export type PropertyModels<TZodObjectType extends z.AnyZodObject> =
    // eslint-disable-next-line@typescript-eslint/no-explicit-any
    TZodObjectType extends Type<infer TUnderlyingObject, any, infer TCatchallType>
        ? {
              [Key in keyof TUnderlyingObject]: PropertyModel<TUnderlyingObject[Key]>;
          } & {
              [key: string]: PropertyModel<TCatchallType>;
          }
        : {
              [key: string]: UnknownPropertyModel;
          };
