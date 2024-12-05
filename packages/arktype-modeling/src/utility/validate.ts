import {
    type AnyTypeConstraint,
    type ValidationResult,
} from '../index.js';
import { Maybe, idPaths } from '@captainpants/sweeter-utilities';
import { safeParse, safeParseAsync } from './parse.js';
import { type type } from 'arktype';

export interface ValidateAndThrowArgs {
    /**
     * View this as an optimisation, where validation of members has already been complicated, we can skip doing it a second time.
     */
    deep?: boolean | undefined;
    abortSignal?: AbortSignal | undefined;
}

export async function validate<TSchema extends AnyTypeConstraint>(
    schema: TSchema,
    value: unknown,
    args: ValidateAndThrowArgs = { deep: true },
): Promise<ValidationResult<type.infer<TSchema>>> {
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

export async function validateAndThrow<TSchema extends AnyTypeConstraint>(
    schema: TSchema,
    value: unknown,
    args: ValidateAndThrowArgs = { deep: true },
): Promise<type.infer<TSchema>> {
    const res = await safeParseAsync(value, schema);

    if (!res.success) {
        throw new Error('Parse error: ' + res.issues.message);
    }

    return res.data;
}

export function shallowMatchesStructure<TSchema extends AnyTypeConstraint>(
    schema: TSchema,
    value: unknown,
    deep = true,
    depth = 25,
): value is type.infer<TSchema> {
    return safeParse(value, schema).success;
}
