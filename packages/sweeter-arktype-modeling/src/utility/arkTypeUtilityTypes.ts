import { type Type, type type } from 'arktype';

import { IsNever, type IsUnion } from '@captainpants/sweeter-utilities';

import {
    type GetExpandoKeys,
    type GetExpandoValueType as GetExpandoValueType,
    type GetNonExpandoKeys,
} from '../internal/utilityTypes.js';
import { PropertyInfo, type AnyTypeConstraint as BaseAnyTypeConstraint } from '../type/types.js';
import { type ReadonlyRecord } from '../types.js';

/**
 * Types that operate on Zod type
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace arkTypeUtilityTypes {
    type _DistributeType<T> = T extends infer _ ? Type<T> : never;
    type _PropertyType<T> = T[keyof T];

    /**
     * This is obsolete, use the top level version.
     */
    export type AnyTypeConstraint = BaseAnyTypeConstraint;

    export type AllPropertyKeys<TSchemaObjectType> =
        keyof type.infer<TSchemaObjectType>;
    export type AllPropertyArkTypes<TSchemaObjectType> = _DistributeType<
        _PropertyType<type.infer<TSchemaObjectType>>
    >;

    export type NonCatchallPropertyKeys<TSchemaObjectType> = GetNonExpandoKeys<
        type.infer<TSchemaObjectType>
    >;
    export type CatchallPropertyKeyRawType<TSchemaObjectType> = GetExpandoKeys<
        type.infer<TSchemaObjectType>
    >;
    export type CatchallPropertyKeySchemas<
        TSchemaObjectType extends AnyTypeConstraint,
    > = _DistributeType<CatchallPropertyKeyRawType<TSchemaObjectType>>;
    export type CatchallPropertyValueSchemas<
        TSchemaObjectType extends AnyTypeConstraint,
    > = _DistributeType<GetExpandoValueType<type.infer<TSchemaObjectType>>>;

    export type CatchallPropertyMap<
        TSchemaObjectType extends AnyTypeConstraint,
    > =
        IsNever<CatchallPropertyKeySchemas<TSchemaObjectType>> extends true
            ? undefined
            : ReadonlyMap<
                  CatchallPropertyKeySchemas<TSchemaObjectType>,
                CatchallPropertyValueSchemas<TSchemaObjectType>
              >;

    export type PropertyType<TSchemaObjectType, Property extends string> =
        AllPropertyArkTypes<TSchemaObjectType> extends ReadonlyRecord<
            Property,
            infer S
        >
            ? S
            : never;

    export type ValuesOfObject<TObject> = TObject[keyof TObject];

    export type ObjectEntryType<TSchemaObjectType> = readonly [
        (
            | keyof AllPropertyArkTypes<TSchemaObjectType>
            | keyof CatchallPropertyKeyRawType<TSchemaObjectType>
        ),
        ValuesOfObject<TSchemaObjectType>,
    ];

    export type ArrayElementType<TArrayArkType extends Type<unknown[]>> =
        /* @ts-expect-error Type-system doesn't understand that type.infer here is always an array */
        type.infer<TArrayArkType>[number];
    export type ArrayElementSchema<TArrayArkType extends Type<unknown[]>> =
        Type<ArrayElementType<TArrayArkType>>;

    export type UnionOptions<TUnionArkType> =
        IsUnion<type.infer<TUnionArkType>> extends true
            ? _DistributeType<type.infer<TUnionArkType>>
            : never;
}
