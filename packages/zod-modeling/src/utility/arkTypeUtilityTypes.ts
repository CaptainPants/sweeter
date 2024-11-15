
import {
    type ReadonlyRecord,
} from '../types.js';
import { Type, type,  } from 'arktype';
import { AnyTypeConstraint as BaseAnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { GetExpandoKeys, GetExpandoType, GetNonExpandoKeys } from '../internal/utilityTypes.js';
import { IsNever, IsUnion } from '@captainpants/sweeter-utilities';

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

    export type AllPropertyKeys<TArkTypeObjectType> = keyof type.infer<TArkTypeObjectType>;
    export type AllPropertyArkTypes<TArkTypeObjectType> = _SpreadWrapType<_PropertyType<type.infer<TArkTypeObjectType>>>;

    export type NonCatchallPropertyKeys<TArkTypeObjectType> = GetNonExpandoKeys<type.infer<TArkTypeObjectType>>;
    export type CatchallPropertyKeyRawType<TArkTypeObjectType> = GetExpandoKeys<type.infer<TArkTypeObjectType>>;
    export type CatchallPropertyValueArkType<TArkTypeObjectType> = Type<GetExpandoType<type.infer<TArkTypeObjectType>>>;

    export type PropertyType<
        TArkTypeObjectType,
        Property extends string,
    > = AllPropertyArkTypes<TArkTypeObjectType> extends ReadonlyRecord<Property, infer S>
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
