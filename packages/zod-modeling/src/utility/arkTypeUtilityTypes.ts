import { type z } from 'zod';
import {
    type ReadonlyRecord,
} from '../types.js';
import { Ark, Type, type,  } from 'arktype';

/**
 * Types that operate on Zod type
 */
export namespace arkTypeUtilityTypes {
    export type AnyTypeConstraint = Type<any, any>;

    export type AllPropertyKeys<TArkTypeObjectType> = TArkTypeObjectType extends Type<infer S>
        ? keyof S
        : never;

    export type AllPropertyTypes<TArkTypeObjectType> = TArkTypeObjectType extends Type<infer S>
        ? S[keyof S]
        : never;

    export type CatchallPropertyKeyType<TArkTypeObjectType> =
        TArkTypeObjectType extends z.ZodObject<any, infer S, any> ? S : never;

    export type CatchallPropertyValueType<TArkTypeObjectType> =
        TArkTypeObjectType extends z.ZodObject<any, any, infer S> ? S : never;

    export type PropertyType<
        TArkTypeObjectType,
        Property extends string,
    > = AllPropertyTypes<TArkTypeObjectType> extends ReadonlyRecord<Property, infer S>
        ? S
        : never;

    export type ValuesOfObject<TObject> = TObject[keyof TObject];

    export type ObjectEntryType<TArkTypeObjectType> = readonly [
        (
            | keyof AllPropertyTypes<TArkTypeObjectType>
            | keyof CatchallPropertyKeyType<TArkTypeObjectType>
        ),
        ValuesOfObject<TArkTypeObjectType> | ValuesOfObject<TArkTypeObjectType>,
    ];

    export type UnionOptions<TUnion> = TUnion extends z.ZodUnion<infer S>
        ? S[number]
        : never;

    export type RecursiveUnionOptions<T> = T extends z.ZodUnion<infer S>
        ? { [Key in keyof S]: RecursiveUnionOptions<S[Key]> }[number]
        : T;

    // export type IsZodTypeAny<TZodType extends z.ZodTypeAny> =
    //     TZodType extends z.ZodType<infer Output, infer Def, infer Input>
    //         ? And<
    //               IsAny<Output>,
    //               TypesEqual<TZodType, z.ZodType<Output, Def, Input>>
    //           >
    //         : false;

    export type ArrayElementType<TArrayZodType extends z.ZodArray<any>> =
        TArrayZodType extends z.ZodArray<infer TArrayElementZodType>
            ? TArrayElementZodType
            : never;

    export type ZodAnyUnionType = z.ZodUnion<
        [z.ZodTypeAny, ...(readonly z.ZodTypeAny[])]
    >;

    export type Unwrap<TStartingType extends z.ZodTypeAny> =
        TStartingType extends z.ZodDefault<infer Inner>
            ? Unwrap<Inner>
            : TStartingType;

    export type UnwrapEx<TStartingType extends z.ZodTypeAny> =
        TStartingType extends z.ZodDefault<infer Inner>
            ? UnwrapEx<Inner>
            : TStartingType extends { unwrap(): infer Inner }
              ? (Inner extends z.ZodTypeAny ? UnwrapEx<Inner> : never)
              : TStartingType;

    export type Wrapped<TZodType> = 
        | TZodType 
        | { unwrap(): TZodType }
        | { unwrap(): z.ZodTypeAny };
}
