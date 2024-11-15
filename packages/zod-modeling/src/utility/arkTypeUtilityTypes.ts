
import {
    type ReadonlyRecord,
} from '../types.js';
import { Type, type,  } from 'arktype';
import { AnyTypeConstraint as BaseAnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { GetExpandoKey, GetExpandoType } from '../internal/utilityTypes.js';
import { IsNever, IsUnion } from '@captainpants/sweeter-utilities';

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

    export type CatchallPropertyKeyType<TArkTypeObjectType> = Type<GetExpandoKey<type.infer<TArkTypeObjectType>>>;

    export type CatchallPropertyValueType<TArkTypeObjectType> = Type<GetExpandoType<type.infer<TArkTypeObjectType>>>;

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

    export type ArrayElementType<TArrayArkType extends Type<any[]>> =
        TArrayArkType extends Type<(infer TElementType)[]>
            ? Type<TElementType>
            : never;

    export type UnionOptions<TUnionArkType> = IsUnion<type.infer<TUnionArkType>> extends true ? 
            type.infer<TUnionArkType> 
        : never;
}
