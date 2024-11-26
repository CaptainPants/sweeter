import { type ReadonlyRecord } from '../types.js';
import { Type, type } from 'arktype';
import { AnyTypeConstraint as BaseAnyTypeConstraint } from '../type/types.js';
import {
    GetExpandoKeys,
    GetExpandoType,
    GetNonExpandoKeys,
} from '../internal/utilityTypes.js';
import { IsUnion } from '@captainpants/sweeter-utilities';

/**
 * Types that operate on Zod type
 */
export namespace arkTypeUtilityTypes {
    type _SpreadWrapType<T> = T extends infer _ ? Type<T> : never;
    type _PropertyType<T> = T[keyof T];

    /**
     * This is obsolete, use the top level version.
     */
    export type AnyTypeConstraint = BaseAnyTypeConstraint;

    export type AllPropertyKeys<TArkTypeObjectType> =
        keyof type.infer<TArkTypeObjectType>;
    export type AllPropertyArkTypes<TArkTypeObjectType> = _SpreadWrapType<
        _PropertyType<type.infer<TArkTypeObjectType>>
    >;

    export type NonCatchallPropertyKeys<TArkTypeObjectType> = GetNonExpandoKeys<
        type.infer<TArkTypeObjectType>
    >;
    export type CatchallPropertyKeyRawType<TArkTypeObjectType> = GetExpandoKeys<
        type.infer<TArkTypeObjectType>
    >;
    export type CatchallPropertyValueArkType<TArkTypeObjectType> = Type<
        GetExpandoType<type.infer<TArkTypeObjectType>>
    >;

    export type PropertyType<
        TArkTypeObjectType,
        Property extends string,
    > = AllPropertyArkTypes<TArkTypeObjectType> extends ReadonlyRecord<
        Property,
        infer S
    >
        ? S
        : never;

    export type ValuesOfObject<TObject> = TObject[keyof TObject];

    export type ObjectEntryType<TArkTypeObjectType> = readonly [
        (
            | keyof AllPropertyArkTypes<TArkTypeObjectType>
            | keyof CatchallPropertyKeyRawType<TArkTypeObjectType>
        ),
        ValuesOfObject<TArkTypeObjectType> | ValuesOfObject<TArkTypeObjectType>,
    ];

    export type ArrayElementType<TArrayArkType extends Type<unknown[]>> =
        /* @ts-expect-error Type-system doesn't understand that type.infer here is always an array */
        type.infer<TArrayArkType>[number];
    export type ArrayElementArkType<TArrayArkType extends Type<unknown[]>> =
        Type<ArrayElementType<TArrayArkType>>;

    export type UnionOptions<TUnionArkType> = IsUnion<
        type.infer<TUnionArkType>
    > extends true
        ? type.infer<TUnionArkType>
        : never;
}
