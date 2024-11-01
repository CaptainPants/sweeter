
import { z } from "zod";

// TODO: how do we conveiently handle wrapper types? I.e. z.ZodDefault
// Also think about z.ZodNullable, z.ZodOptional as they are effectively unions
// but presumably won't return true to X instanceof ZodUnion

export function isDefaultWrapper(
    schema: z.ZodTypeAny,
): schema is z.ZodDefault<z.ZodTypeAny> {
    return schema instanceof z.ZodDefault;
}
export function isNullableWrapper(
    schema: z.ZodTypeAny,
): schema is z.ZodNullable<z.ZodTypeAny> {
    return schema instanceof z.ZodNullable;
}
export function isOptionalWrapper(
    schema: z.ZodTypeAny,
): schema is z.ZodOptional<z.ZodTypeAny> {
    return schema instanceof z.ZodOptional;
}