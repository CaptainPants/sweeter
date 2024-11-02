import { z } from "zod";
import { arkTypeUtilityTypes } from "../utility";

/**
 * Remove any layered augmentation types. At present this is ZodDefault<T>.
 * @param schema 
 * @returns 
 */
export function unwrap<TZodType extends z.ZodTypeAny>(schema: TZodType): arkTypeUtilityTypes.Unwrap<TZodType> {
    if (schema instanceof z.ZodDefault) {
        return unwrap(schema.removeDefault());
    }
    return schema as any;
}