import { type z } from 'zod';
import {
    type ReadonlyRecord,
} from '../types.js';
import { Type, type,  } from 'arktype';
import { AnyTypeConstraint as BaseAnyTypeConstraint } from '../type/AnyTypeConstraint.js';

/**
 * Types that operate on Zod type
 */
export namespace arkTypeUtilityTypes {
    /**
     * This is obsolete, use the top level version.
     */
    export type AnyTypeConstraint = BaseAnyTypeConstraint;

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

}
