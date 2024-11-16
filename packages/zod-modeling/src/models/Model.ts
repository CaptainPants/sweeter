
import { AnyTypeConstraint, type ReadonlyRecord } from '../index.js';

import { type ParentTypeInfo } from './parents.js';
import {
    type UnknownPropertyModel,
    type PropertyModel,
} from './PropertyModel.js';
import { type arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';
import { type, Type } from 'arktype';
import { IsBooleanLiteral, IsLiteral, IsNever, IsNumberLiteral, IsStringLiteral, IsUnion } from '@captainpants/sweeter-utilities';
import { ObjectType } from 'arktype/internal/methods/object.ts';
import { GetNonExpandoKeys } from '../internal/utilityTypes.js';

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
export interface NumberModel extends SimpleModel<number, Type<number>> {}
export interface BooleanModel extends SimpleModel<boolean, Type<boolean>> {}

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
    unknownGetElementType: () => Type<unknown>;

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
    getElementType: () => arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>;

    getElement: (
        index: number,
    ) => ElementModelNoConstraint<TArrayArkType> | undefined;

    getElements: () => ReadonlyArray<
        ElementModelNoConstraint<TArrayArkType>
    >;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            | type.infer<arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>>
            | ElementModelNoConstraint<TArrayArkType>
        >,
        validate?: boolean,
    ) => Promise<this>;
}

export type TypedPropertyModelForKey<
    TArkObjectType extends AnyTypeConstraint,
    TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType>,
> = TKey extends arkTypeUtilityTypes.AllPropertyKeys<TArkObjectType>
    ? PropertyModelNoConstraint<arkTypeUtilityTypes.AllPropertyArkTypes<TArkObjectType>>
    :
          | PropertyModelNoConstraint<
                arkTypeUtilityTypes.CatchallPropertyValueArkType<TArkObjectType>
            >
          | undefined;

interface UnknownObjectModelMethods {
    unknownGetProperty(key: string): UnknownPropertyModel | undefined;

    unknownSetProperty(
        key: string,
        value: unknown,
        triggerValidation?: boolean,
    ): Promise<this>;

    unknownGetCatchallType(): AnyTypeConstraint | undefined;

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

export interface ObjectModel<TObjectArkType extends AnyTypeConstraint>
    extends ModelBase<type.infer<TObjectArkType>, TObjectArkType>,
        UnknownObjectModelMethods {
    getCatchallType(): arkTypeUtilityTypes.CatchallPropertyValueArkType<TObjectArkType>;

    getProperty<
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TObjectArkType> & string,
    >(
        key: TKey,
    ): TypedPropertyModelForKey<TObjectArkType, TKey>;

    getProperties(): readonly PropertyModelNoConstraint<
        arkTypeUtilityTypes.AllPropertyArkTypes<TObjectArkType>
    >[];

    setProperty<TKey extends keyof type.infer<TObjectArkType> & string>(
        key: TKey,
        value: type.infer<TObjectArkType>[TKey],
        triggerValidation?: boolean,
    ): Promise<this>;
}

export interface UnknownUnionModelMethods {
    as: <TTargetArkType extends AnyTypeConstraint>(
        type: TTargetArkType,
    ) => Model<TTargetArkType> | null;

    unknownGetDirectlyResolved: () => UnknownModel;

    getTypes: () => ReadonlyArray<AnyTypeConstraint>;

    replace: (value: unknown, validate?: boolean) => Promise<this>;
}

export interface UnionModelMethods<
    TUnionArkType extends AnyTypeConstraint,
> extends UnknownUnionModelMethods {
    getDirectlyResolved: () => SpreadModel<arkTypeUtilityTypes.UnionOptions<TUnionArkType>>;
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

export type Model<TArkType extends Type<any>> = type.infer<TArkType> extends infer TUnderlying ? 
    (TArkType extends Type<unknown[]>
        ? ArrayModel<TArkType>
    : IsStringLiteral<TUnderlying> extends true
        /* @ts-ignore - not narrowing TArkType but we know its a string */
        ? StringConstantModel<TArkType>
    : IsNumberLiteral<TUnderlying> extends true
        /* @ts-ignore - not narrowing TArkType but we know its a string */
        ? NumberConstantModel<TArkType>
    : IsBooleanLiteral<TUnderlying> extends true
        /* @ts-ignore - not narrowing TArkType but we know its a string */
        ? BooleanConstantModel<TArkType>
    : TUnderlying extends string
        ? StringModel
    : TUnderlying extends number
        ? NumberModel
    : TUnderlying extends boolean
        ? BooleanModel
    : TUnderlying extends null
        ? NullModel
    : TUnderlying extends undefined
        ? UndefinedModel
    // Its important that this is after boolean, as TypeScript treats boolean
    // as a union: true|false and therefore IsUnion<boolean> is true.
    : IsUnion<TUnderlying> extends true 
        ? UnionModel<TArkType> 
    : ObjectModel<TArkType>)
: never;


export type PropertyModelNoConstraint<TType> = TType extends AnyTypeConstraint ? PropertyModel<TType> : never; 
export type ElementModelNoConstraint<TType> = TType extends Type<(infer S)[]> ? S extends AnyTypeConstraint ? Model<S> : never : never;
