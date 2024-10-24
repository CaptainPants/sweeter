import { z } from 'zod';

export interface ValidateAndThrowArgs {
    /**
     * View this as an optimisation, where validation of members has already been complicated, we can skip doing it a second time.
     */
    deep?: boolean | undefined;
    abortSignal?: AbortSignal | undefined;
}

export async function validate<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
    value: unknown,
    args: ValidateAndThrowArgs = { deep: true },
): value is z.infer<TZodType> {
    return (await schema.safeParseAsync(value)).data;
}

export async function validateAndThrow<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
    value: unknown,
    args: ValidateAndThrowArgs = { deep: true },
): Promise<z.infer<TZodType>> {
    const res = await schema.safeParseAsync(value);

    if (!res.success) {
        throw new Error('Parse error: ' + res.error.message);
    }

    return res.data;
}

export function matches<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
    value: unknown,
): value is z.infer<TZodType> {
    return schema.safeParse(value).data;
}
