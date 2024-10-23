import { z } from "zod";


export interface ValidateAndThrowArgs {
    deep?: boolean | undefined;
    abortSignal?: AbortSignal | undefined;
}

export function validate<TZodType extends z.ZodTypeAny>(schema: TZodType, value: unknown, args: ValidateAndThrowArgs = { deep: true }): value is z.infer<TZodType> {
    return schema.safeParse(value).data;
}

export async function validateAndThrow<TZodType extends z.ZodTypeAny>(schema: TZodType, value: unknown, args: ValidateAndThrowArgs = { deep: true }): Promise<z.infer<TZodType>> {
    const res = await schema.safeParseAsync(value);

    if (!res.success) {
        throw new Error('Parse error: ' + res.error.message)
    }

    return res.data;
}