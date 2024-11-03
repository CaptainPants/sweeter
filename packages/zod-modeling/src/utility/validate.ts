import { type z } from 'zod';
import { arkTypeUtilityTypes, type ValidationResult } from '../index.js';
import { Maybe, idPaths } from '@captainpants/sweeter-utilities';
import { safeParse, safeParseAsync } from './parse.js';
import { type } from 'arktype';

export interface ValidateAndThrowArgs {
    /**
     * View this as an optimisation, where validation of members has already been complicated, we can skip doing it a second time.
     */
    deep?: boolean | undefined;
    abortSignal?: AbortSignal | undefined;
}

export async function validate<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
    schema: TArkType,
    value: unknown,
    args: ValidateAndThrowArgs = { deep: true },
): Promise<ValidationResult<type.infer<TArkType>>> {
    const res = await safeParseAsync(value, schema);
    if (res.success) return Maybe.success(res.data);
    else
        return {
            success: false,
            error: res.issues.map((issue) => {
                return {
                    message: issue.message,
                    idPath: idPaths.join(issue.path),
                } as const;
            }), // TODO: there is a lot more detail here, but lets start with message
        };
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

export function shallowMatchesStructure<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
    schema: TArkType,
    value: unknown,
    deep = true,
    depth = 25,
): value is type.infer<TArkType> {
    return safeParse(value, schema).success;
}
