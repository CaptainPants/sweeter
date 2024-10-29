import { z } from 'zod';
import { ReadonlyRecord } from '../types.js';

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

    export type IsAny<T> = 0 extends T & 1 ? true : false;

    export type ArrayElementType<TArrayZodType extends z.ZodArray<any>> = TArrayZodType extends z.ZodArray<infer TArrayElementZodType> ? TArrayElementZodType : never;

    export type ZodAnyUnionType = z.ZodUnion<[z.ZodTypeAny, ...readonly z.ZodTypeAny[]]>;
}
