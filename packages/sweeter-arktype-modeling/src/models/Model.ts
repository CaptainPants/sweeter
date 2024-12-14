import { type type, type Type } from 'arktype';

import {
    type AnyObjectTypeConstraint,
    type AnyTypeConstraint,
    type UnknownObjectType,
    type UnknownType,
    type ReadonlyRecord,
} from '../index.js';

import { type ParentTypeInfo } from './parents.js';
import {
    type UnknownPropertyModel,
    type PropertyModel,
} from './PropertyModel.js';
import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';
import {
    type IsAny,
    type IsBooleanLiteral,
    type IsNumberLiteral,
    type IsStringLiteral,
    type IsUnion,
} from '@captainpants/sweeter-utilities';

export interface BaseModel<TValue, TSchema extends AnyTypeConstraint> {
    readonly value: TValue;
    readonly type: TSchema;
    readonly parentInfo: ParentTypeInfo | null;
    readonly archetype: string;
}

export interface SimpleModel<T, TSchema extends AnyTypeConstraint>
    extends BaseModel<T, TSchema> {
    readonly archetype: string;
}

export interface StringModel extends SimpleModel<string, Type<string>> {}
export interface NumberModel extends SimpleModel<number, Type<number>> {}
export interface BooleanModel extends SimpleModel<boolean, Type<boolean>> {}

// Constants

export interface LiteralModel<
    TSchema extends Type<string | number | boolean | null | undefined>,
> extends SimpleModel<type.infer<TSchema>, TSchema> {}

export interface StringConstantModel<TLiteralArkType extends Type<string>>
    extends LiteralModel<TLiteralArkType> {}

export interface NumberConstantModel<TLiteralArkType extends Type<number>>
    extends LiteralModel<TLiteralArkType> {}

export interface BooleanConstantModel<TLiteralArkType extends Type<boolean>>
    extends LiteralModel<TLiteralArkType> {}

export interface NullModel extends LiteralModel<Type<null>> {}

export interface UndefinedModel extends LiteralModel<Type<undefined>> {}

export interface UnknownArrayModelMethods {
    unknownGetElementType: () => Type<unknown>;

    unknownGetElement: (index: number) => UnknownModel | undefined;

    unknownGetElements: () => ReadonlyArray<UnknownModel>;

    unknownSpliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<unknown | UnknownModel>,
        validate?: boolean,
    ) => Promise<this>;

    unknownSetIndex: (index: number, value: unknown | UnknownModel, validate?: boolean) => Promise<this>;

    moveElement: (
        from: number,
        to: number,
        validate?: boolean,
    ) => Promise<this>;
}

export interface UnknownArrayModel
    extends BaseModel<readonly unknown[], Type<unknown[]>>,
        UnknownArrayModelMethods {}
``;
// eslint-disable-next-line@typescript-eslint/no-explicit-any
export interface ArrayModel<TArraySchema extends Type<unknown[]>>
    extends BaseModel<type.infer<TArraySchema>, TArraySchema>,
        UnknownArrayModelMethods {
    getElementType: () => arkTypeUtilityTypes.ArrayElementSchema<TArraySchema>;

    getElement: (
        index: number,
    ) => ElementModel<TArraySchema> | undefined;

    getElements: () => ReadonlyArray<ElementModel<TArraySchema>>;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            | type.infer<arkTypeUtilityTypes.ArrayElementSchema<TArraySchema>>
            | ElementModel<TArraySchema>
        >,
        validate?: boolean,
    ) => Promise<this>;

    setIndex: (index: number, value: ElementModel<TArraySchema>, validate?: boolean) => Promise<this>;
}

export type TypedPropertyModelForKey<
    TArkObjectType extends AnyTypeConstraint,
    TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType>,
> =
    TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType>
        ? PropertyModelNoConstraint<
              arkTypeUtilityTypes.AllPropertyArkTypes<TArkObjectType>
          >
        :
              | PropertyModelNoConstraint<
                    arkTypeUtilityTypes.CatchallPropertyValueSchemas<TArkObjectType>
                >
              | undefined;

interface UnknownObjectModelMethods {
    unknownGetProperty(key: string | symbol): UnknownPropertyModel | undefined;

    unknownSetProperty(key: string | symbol, value: unknown): Promise<this>;

    unknownGetCatchallType(): ReadonlyMap<UnknownType, UnknownType> | undefined;

    deleteProperty(key: string | symbol, validate?: boolean): Promise<this>;

    moveProperty(
        from: string | symbol,
        to: string | symbol,
        validate?: boolean,
    ): Promise<this>;

    unknownGetProperties(): readonly UnknownPropertyModel[];
}

export interface UnknownObjectModel
    extends BaseModel<ReadonlyRecord<string, unknown>, UnknownObjectType>,
        UnknownObjectModelMethods {}

export type UnknownMapObjectEntry = readonly [
    name: string,
    model: UnknownPropertyModel,
];

export type MapObjectEntry<TSchema extends AnyTypeConstraint> = readonly [
    name: string,
    model: PropertyModel<TSchema>,
];

export interface ObjectModel<TObjectSchema extends AnyObjectTypeConstraint>
    extends BaseModel<type.infer<TObjectSchema>, TObjectSchema>,
        UnknownObjectModelMethods {
    getCatchallType(): arkTypeUtilityTypes.CatchallPropertyMap<TObjectSchema>;

    getProperty<
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TObjectSchema> &
            string,
    >(
        key: TKey,
    ): TypedPropertyModelForKey<TObjectSchema, TKey>;

    getProperties(): readonly PropertyModelNoConstraint<
        arkTypeUtilityTypes.AllPropertyArkTypes<TObjectSchema>
    >[];

    setProperty<TKey extends keyof type.infer<TObjectSchema> & string>(
        key: TKey,
        value: type.infer<TObjectSchema>[TKey],
    ): Promise<this>;
}

export interface UnknownUnionModelMethods {
    as: <TTargetArkType extends AnyTypeConstraint>(
        type: TTargetArkType,
    ) => Model<TTargetArkType> | null;

    unknownResolve: () => UnknownModel;

    getTypes: () => ReadonlyArray<AnyTypeConstraint>;

    replace: (value: unknown, validate?: boolean) => Promise<this>;
}

export interface UnionModelMethods<TUnionArkType extends AnyTypeConstraint>
    extends UnknownUnionModelMethods {
    resolve: () => SpreadModel<arkTypeUtilityTypes.UnionOptions<TUnionArkType>>;
}

export interface UnknownUnionModel
    extends BaseModel<unknown, Type<unknown>>,
        UnknownUnionModelMethods {}

export interface UnionModel<TUnion extends AnyTypeConstraint>
    extends BaseModel<type.infer<TUnion>, TUnion>,
        UnionModelMethods<TUnion> {}

export type SpreadModel<TUnionOfSchemas extends AnyTypeConstraint> =
    TUnionOfSchemas extends infer _ ? Model<TUnionOfSchemas> : never;

export interface UnknownTypedModel extends BaseModel<unknown, Type<unknown>> {}

export type UnknownModel = BaseModel<unknown, Type<unknown>>;

export type KnownModel =
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
    | UnknownTypedModel;

export type AnyModelConstraint = UnknownModel;

// Implementation notes:
// - 'boolean' is treated as a union by typescript so boolean types need to be
//   handled before unions.
// - Literal types need to be before their base types, as 1|2 extends number

export type Model<TSchema extends AnyTypeConstraint> = [
    type.infer<TSchema>,
] extends [infer TUnderlying]
    ? IsAny<TUnderlying> extends true
        ? UnknownTypedModel
        : [TSchema] extends [Type<unknown[]>]
          ? ArrayModel<TSchema>
          : [IsBooleanLiteral<TUnderlying>] extends [true]
            ? BooleanConstantModel<TSchema>
            : [TUnderlying] extends [boolean]
              ? BooleanModel
              : // Its important that this is after boolean, as TypeScript treats boolean
                // as a union: true|false and therefore IsUnion<boolean> is true.
                [IsUnion<TUnderlying>] extends [true]
                ? UnionModel<TSchema>
                : [IsStringLiteral<TUnderlying>] extends [true]
                  ? /* @ts-expect-error - not narrowing TSchema but we know its a string */
                    StringConstantModel<TSchema>
                  : [TUnderlying] extends [string] // be wary that ('a'|'b') extends string, so this must happen after union
                    ? StringModel
                    : [IsNumberLiteral<TUnderlying>] extends [true]
                      ? /* @ts-expect-error - not narrowing TSchema but we know its a string */
                        NumberConstantModel<TSchema>
                      : [TUnderlying] extends [number] // be wary that (1|2) extends number, so this must happen after union
                        ? NumberModel
                        : [TUnderlying] extends [null]
                          ? NullModel
                          : [TUnderlying] extends [undefined]
                            ? UndefinedModel
                            : [TUnderlying] extends [object]
                              ? /* @ts-expect-error - not narrowing TSchema but we know its an object */
                                ObjectModel<TSchema>
                              : /* eslint-disable-next-line @typescript-eslint/ban-types -- We want the model for a Function to be 'never' at the moment so need this check */
                                [TUnderlying] extends [Function] | [symbol]
                                ? never
                                : BaseModel<TUnderlying, TSchema>
    : never;

export type PropertyModelNoConstraint<TType> = [TType] extends [
    AnyTypeConstraint,
]
    ? PropertyModel<TType>
    : never;
export type ElementModel<TType extends AnyTypeConstraint> = [TType] extends [
    Type<(infer S)[]>,
]
    ? [Type<S>] extends [AnyTypeConstraint]
        ? Model<Type<S>>
        : never
    : never;
export type ModelNoConstraint<TType> = [TType] extends [AnyTypeConstraint]
    ? Model<TType>
    : never;
