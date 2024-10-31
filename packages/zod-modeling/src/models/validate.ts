import { z } from 'zod';
import { ValidationResult } from '..';
import { Maybe, idPaths } from '@captainpants/sweeter-utilities';

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
): Promise<ValidationResult<z.infer<TZodType>>> {
    const res = (await schema.safeParseAsync(value));
    if (res.success) return Maybe.success(res.data);
    else return {
        success: false,
        error: res.error.issues.map(issue => {
            return { 
                message: issue.message,
                idPath: idPaths.join(issue.path)
            } as const;
        }) // TODO: there is a lot more detail here, but lets start with message
    }
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
