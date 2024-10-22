import { z } from 'zod';
import {
    type ReadonlyRecord,
} from '../index.js';
import { type IsUnion } from '../internal/unions.js';

import { type ParentTypeInfo } from './parents.js';
import { type PropertyModel } from './PropertyModel.js';

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

// Constants

export interface StringConstantModel<TZodLiteralType extends z.ZodLiteral<string>>
    extends SimpleModel<z.infer<TZodLiteralType>, z.ZodLiteral<TZodLiteralType>> {}

export interface NumberConstantModel<TZodLiteralType extends z.ZodLiteral<number>>
    extends SimpleModel<z.infer<TZodLiteralType>, z.ZodLiteral<TZodLiteralType>> {}

export interface BooleanConstantModel<TZodLiteralType extends z.ZodLiteral<boolean>>
    extends SimpleModel<z.infer<TZodLiteralType>, z.ZodLiteral<TZodLiteralType>> {}

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
    extends ModelBase<readonly unknown[], z.ZodArray<any>>,
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

/**
 * Type of property modes expected from an object. Adds in undefined for Record<string, unknown> models.
 */
export type PropertyModelFor<TObject, TKey extends keyof TObject> =
    | PropertyModel<TObject[TKey]>
    | (string extends keyof TObject ? undefined : never);

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

namespace ObjectTypeUtils {
    export type ShapeOf<TZodObjectType> = TZodObjectType extends z.ZodObject<infer S, any, any> ? S : never;
    export type CatchallPropertyKeyType<TZodObjectType> = TZodObjectType extends z.ZodObject<any, infer S, any> ? S : never;
    export type CatchallPropertyValueType<TZodObjectType> = TZodObjectType extends z.ZodObject<any, any, infer S> ? S : never;
    export type PropertyType<Obj, Property extends string> = ShapeOf<Obj> extends ReadonlyRecord<Property, infer S> ? S : never;
    export type Values<T> = T[keyof T];

    export type ObjectEntryType<TZodObjectType> = readonly [
        keyof ShapeOf<TZodObjectType> | keyof CatchallPropertyKeyType<TZodObjectType>, 
        Values<TZodObjectType> | Values<TZodObjectType>
    ];
}

export interface ObjectModel<
    TObject extends z.AnyZodObject
>
    extends ModelBase<z.infer<TObject>, TObject>,
        UnknownObjectModelMethods {
            
    getCatchallType(): ObjectTypeUtils.CatchallPropertyValueType<TObject>;

    setCatchallProperty(
        key: ObjectTypeUtils.CatchallPropertyKeyType<TObject>,
        value: ObjectTypeUtils.CatchallPropertyValueType<TObject>,
        triggerValidation?: boolean,
    ): Promise<this>;

    getCatchallProperty(key: string): Model<ObjectTypeUtils.CatchallPropertyValueType<TObject>> | undefined;

    getEntries(): ObjectTypeUtils.ObjectEntryType<TObject>[];
    
    getProperty<TKey extends keyof TObject & string>(
        key: TKey,
    ): PropertyModelFor<TObject, TKey>;

    getProperties(): Array<PropertyModel<TObject[keyof TObject]>>;

    setProperty<TKey extends keyof TObject & string>(
        key: TKey,
        value: TObject[TKey],
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
    // Note that BooleanModel is actually UnionModel<true | false>
    | BooleanConstantModel<z.ZodLiteral<true>>
    | BooleanConstantModel<z.ZodLiteral<false>>
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
    // Note that BooleanModel is actually UnionModel<true | false>
    | BooleanConstantModel<z.ZodLiteral<true>>
    | BooleanConstantModel<z.ZodLiteral<false>>
    | NullModel
    | UndefinedModel
    | RealUnknownModel;

export type Model<TType extends z.ZodTypeAny> = TType extends z.ZodUnion<any>
    ? UnionModel<TType>
    : TType extends z.ZodArray<infer TElementType>
      ? ArrayModel<TElementType>
      : TType extends z.ZodObject<infer TShape>
        ? ObjectModel<TType>
        : TType extends z.ZodLiteral<infer TLiteralType>
            ? TLiteralType extends string ? StringConstantModel<z.ZodLiteral<TLiteralType>> 
            : TLiteralType extends number ? NumberConstantModel<z.ZodLiteral<TLiteralType>>
            : TLiteralType extends boolean ? BooleanConstantModel<z.ZodLiteral<TLiteralType>>
            : never
        : TType extends z.ZodString ? StringModel
        : TType extends z.ZodNumber ? NumberModel
        // : TType extends z.ZodBoolean ? BooleanModel
        : TType extends z.ZodNull ? NullModel
        : TType extends z.ZodUndefined ? UndefinedModel
        : UnknownModel;
