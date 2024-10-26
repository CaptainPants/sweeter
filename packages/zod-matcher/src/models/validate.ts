import { z } from 'zod';

export interface ValidateAndThrowArgs {
    /**
     * View this as an optimisation, where validation of members has already been complicated, we can skip doing it a second time.
     */
    deep?: boolean | undefined;
    abortSignal?: AbortSignal | undefined;
}

export const failedValidation: unique symbol = Symbol('failed validation');

export async function validate<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
    value: unknown,
    args: ValidateAndThrowArgs = { deep: true },
): Promise<z.infer<TZodType> | typeof failedValidation> {
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

export function shallowMatchesStructure<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
    value: unknown,
    deep = true,
    depth = 25
): value is z.infer<TZodType> {
    return schema.safeParse(value).data;
}
