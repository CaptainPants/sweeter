import { z } from 'zod';
import {
    type ReadonlyRecord,
} from '../index.js';
import { type IsUnion } from '../internal/unions.js';

import { type ParentTypeInfo } from './parents.js';
import { type PropertyModel } from './PropertyModel.js';
import { zodUtilityTypes } from '../utility/zodUtilityTypes.js';

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

export interface StringConstantModel<TZodLiteralType extends z.ZodLiteral<string>>
    extends SimpleModel<z.infer<TZodLiteralType>, TZodLiteralType> {}

export interface NumberConstantModel<TZodLiteralType extends z.ZodLiteral<number>>
    extends SimpleModel<z.infer<TZodLiteralType>, TZodLiteralType> {}

export interface BooleanConstantModel<TZodLiteralType extends z.ZodLiteral<boolean>>
    extends SimpleModel<z.infer<TZodLiteralType>, TZodLiteralType> {}

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

export interface ArrayModel<TElementType extends z.ZodTypeAny>
    extends ModelBase<readonly TElementType[], z.ZodArray<z.ZodType<TElementType>>>,
        UnknownArrayModelMethods {
    getElementType: () => TElementType;

    getElement: (index: number) => Model<TElementType> | undefined;

    getElements: () => ReadonlyArray<Model<TElementType>>;

    spliceElements: (
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<TElementType | Model<TElementType>>,
        validate?: boolean,
    ) => Promise<this>;
}

export type TypedPropertyModelFor<TZodObjectType, TKey extends keyof zodUtilityTypes.Shape<TZodObjectType>> =
    | PropertyModel<zodUtilityTypes.Shape<TZodObjectType>[TKey]>;

interface UnknownObjectModelMethods {
    unknownGetProperty(key: string): PropertyModel<unknown> | undefined;

    unknownGetProperties(): Array<PropertyModel<unknown>>;

    unknownSetProperty(
        key: string,
        value: unknown,
        triggerValidation?: boolean,
    ): Promise<this>;

    unknownGetItemType(): z.ZodType<unknown>;

    unknownSetProperty(
        key: string,
        value: unknown,
        triggerValidation?: boolean,
    ): Promise<this>;

    unknownGetCatchallProperty(key: string): UnknownModel | undefined;

    deleteCatchallProperty(key: string, validate?: boolean): Promise<this>;

    moveCatchallProperty(from: string, to: string, validate?: boolean): Promise<this>;

    unknownGetEntries(): readonly UnknownMapObjectEntry[];
}

export interface UnknownObjectModel
    extends ModelBase<ReadonlyRecord<string, unknown>, z.AnyZodObject>,
        UnknownObjectModelMethods {}

export type UnknownMapObjectEntry = readonly [
    name: string,
    model: UnknownModel,
];

export type MapObjectEntry<TValue extends z.ZodTypeAny> = readonly [
    name: string,
    model: Model<TValue>,
];

export interface ObjectModel<
    TZodObjectType extends z.AnyZodObject
>
    extends ModelBase<z.infer<TZodObjectType>, TZodObjectType>,
        UnknownObjectModelMethods {
            
    getCatchallType(): zodUtilityTypes.CatchallPropertyValueType<TZodObjectType>;

    setCatchallProperty(
        key: zodUtilityTypes.CatchallPropertyKeyType<TZodObjectType>,
        value: zodUtilityTypes.CatchallPropertyValueType<TZodObjectType>,
        triggerValidation?: boolean,
    ): Promise<this>;

    getCatchallProperty(key: string): Model<zodUtilityTypes.CatchallPropertyValueType<TZodObjectType>> | undefined;

    getEntries(): zodUtilityTypes.ObjectEntryType<TZodObjectType>[];
    
    getProperty<TKey extends zodUtilityTypes.Shape<TZodObjectType>>(
        key: TKey,
    ): TypedPropertyModelFor<TZodObjectType, TKey>;

    getProperties(): Array<PropertyModel<zodUtilityTypes.ValuesOfObject<zodUtilityTypes.Shape<TZodObjectType>>>>;

    setProperty<TKey extends keyof TZodObjectType & string>(
        key: TKey,
        value: TZodObjectType[TKey],
        triggerValidation?: boolean,
    ): Promise<this>;
}

export interface UnknownUnionModelMethods {
    as: <TAs extends z.ZodTypeAny>(type: z.ZodType<TAs>) => Model<TAs> | null;

    getDirectlyResolved: () => UnknownModel;

    unknownGetRecursivelyResolved: () => UnknownModel;

    getTypes: () => ReadonlyArray<z.ZodTypeAny>;

    replace: (value: unknown, validate?: boolean) => Promise<this>;
}

export interface UnionModelMethods<TUnionType extends z.ZodTypeAny> extends UnknownUnionModelMethods {
    getRecursivelyResolved: () => SpreadModel<TUnionType>;
}

export interface UnknownUnionModel
    extends ModelBase<unknown, z.ZodUnion<any>>,
        UnknownUnionModelMethods {}

export interface UnionModel<TUnion extends z.ZodUnion<any>>
    extends ModelBase<z.infer<TUnion>, TUnion>,
        UnionModelMethods<TUnion> {}

/**
 * Use conditional to convert Model<T1 | T2> to Model<T1> | Model<T2>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpreadModel<T extends z.ZodTypeAny> = T extends any ? Model<T> : never;

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
    | BooleanConstantModel<z.ZodLiteral<boolean>>
    | NullModel
    | UndefinedModel
    | RealUnknownModel;

export type Model<TType extends z.ZodTypeAny> = [TType] extends [z.ZodTypeAny] ? UnknownModel 
    : TType extends z.ZodUnion<any>
    ? UnionModel<TType>
    : TType extends z.ZodArray<infer TElementType>
      ? ArrayModel<TElementType>
      : TType extends z.AnyZodObject
        ? ObjectModel<TType>
        : TType extends z.ZodLiteral<infer TLiteralType>
            ? /* Block distribution by comparing a 1-tuple */ [TLiteralType] extends [boolean] ? BooleanConstantModel<z.ZodLiteral<TLiteralType>>
            : TLiteralType extends string ? StringConstantModel<z.ZodLiteral<TLiteralType>> 
            : TLiteralType extends number ? NumberConstantModel<z.ZodLiteral<TLiteralType>>
            :  never
        : TType extends z.ZodString ? StringModel
        : TType extends z.ZodNumber ? NumberModel
        : TType extends z.ZodBoolean ? BooleanModel
        : TType extends z.ZodNull ? NullModel
        : TType extends z.ZodUndefined ? UndefinedModel
        : UnknownModel;

export type FixedPropertyModels<TZodObjectType extends z.AnyZodObject> = TZodObjectType extends z.ZodObject<infer TShape> ? 
    {
        [TKey in keyof TShape]: Model<TShape[TKey]>;
    } : never;
export type CatchallPropertyModels<TZodObjectType extends z.AnyZodObject> = TZodObjectType extends z.ZodObject<any, any, infer TCatchallType> ? 
    {
        [key: string]: Model<TCatchallType>;
    } : never;