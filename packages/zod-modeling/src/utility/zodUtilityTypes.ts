import { type z } from 'zod';
import { type And, type IsAny, type ReadonlyRecord, type TypesEqual } from '../types.js';

/**
 * Types that operate on Zod type
 */
export namespace zodUtilityTypes {
    export type Shape<TZodObjectType> = TZodObjectType extends z.ZodObject<
        infer S,
        any,
        any
    >
        ? S
        : never;
    export type CatchallPropertyKeyType<TZodObjectType> =
        TZodObjectType extends z.ZodObject<any, infer S, any> ? S : never;
    export type CatchallPropertyValueType<TZodObjectType> =
        TZodObjectType extends z.ZodObject<any, any, infer S> ? S : never;
    export type PropertyType<
        TZodObjectType,
        Property extends string,
    > = Shape<TZodObjectType> extends ReadonlyRecord<Property, infer S>
        ? S
        : never;

    export type ValuesOfObject<T> = T[keyof T];

    export type ObjectEntryType<TZodObjectType> = readonly [
        (
            | keyof Shape<TZodObjectType>
            | keyof CatchallPropertyKeyType<TZodObjectType>
        ),
        ValuesOfObject<TZodObjectType> | ValuesOfObject<TZodObjectType>,
    ];

    export type UnionOptions<TUnion> = TUnion extends z.ZodUnion<infer S>
        ? S[number]
        : never;

    export type RecursiveUnionOptions<T> = T extends z.ZodUnion<infer S>
        ? { [Key in keyof S]: RecursiveUnionOptions<S[Key]> }[number]
        : T;

    export type IsZodTypeAny<TZodType extends z.ZodTypeAny> =
        TZodType extends z.ZodType<infer Output, infer Def, infer Input>
            ? And<
                  IsAny<Output>,
                  TypesEqual<TZodType, z.ZodType<Output, Def, Input>>
              >
            : false;

    export type ArrayElementType<TArrayZodType extends z.ZodArray<any>> =
        TArrayZodType extends z.ZodArray<infer TArrayElementZodType>
            ? TArrayElementZodType
            : never;

    export type ZodAnyUnionType = z.ZodUnion<
        [z.ZodTypeAny, ...(readonly z.ZodTypeAny[])]
    >;
}
