import { type type } from 'arktype';

import { descend, idPaths, Maybe } from '@captainpants/sweeter-utilities';

import { type AnyTypeConstraint, type ValidationResult } from '../index.js';

import { safeParse, safeParseAsync } from './parse.js';

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
    // TODO: we probably need to just remove this feature as it doesn't work since ArkType
    _args: ValidateAndThrowArgs = { deep: true },
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
    _args: ValidateAndThrowArgs = { deep: true },
): Promise<type.infer<TSchema>> {
    const res = await safeParseAsync(value, schema);

    if (!res.success) {
        throw new Error('Parse error: ' + res.issues.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- linter is choking
    return res.data;
}

export function shallowMatchesStructure<TSchema extends AnyTypeConstraint>(
    schema: TSchema,
    value: unknown,
    _deep = true,
    _depth = descend.defaultDepth,
): value is type.infer<TSchema> {
    return safeParse(value, schema).success;
}
