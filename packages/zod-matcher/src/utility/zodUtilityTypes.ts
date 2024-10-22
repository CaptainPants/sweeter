import { z } from "zod";
import { ReadonlyRecord } from "../types.js";

export namespace zodUtilityTypes {
    export type Shape<TZodObjectType> = TZodObjectType extends z.ZodObject<infer S, any, any> ? S : never;
    export type CatchallPropertyKeyType<TZodObjectType> = TZodObjectType extends z.ZodObject<any, infer S, any> ? S : never;
    export type CatchallPropertyValueType<TZodObjectType> = TZodObjectType extends z.ZodObject<any, any, infer S> ? S : never;
    export type PropertyType<TZodObjectType, Property extends string> = Shape<TZodObjectType> extends ReadonlyRecord<Property, infer S> ? S : never;
    
    export type ValuesOfObject<T> = T[keyof T];

    export type ObjectEntryType<TZodObjectType> = readonly [
        keyof Shape<TZodObjectType> | keyof CatchallPropertyKeyType<TZodObjectType>, 
        ValuesOfObject<TZodObjectType> | ValuesOfObject<TZodObjectType>
    ];
}