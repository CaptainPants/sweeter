import { type ArkErrors, type } from 'arktype';

import { type AnyTypeConstraint } from '../type/index.js';

export type SafeParseResult<TSchema extends AnyTypeConstraint> =
    | { success: true; data: type.infer<TSchema> }
    | { success: false; summary: string; issues: ArkErrors };

export function safeParse<TSchema extends AnyTypeConstraint>(
    value: unknown,
    schema: TSchema,
): SafeParseResult<TSchema> {
    const res = schema(value);

    if (res instanceof type.errors) {
        return { success: false, summary: res.summary, issues: res.issues };
    }
    return { success: true, data: value as type.infer<TSchema> };
}

export function parse<TSchema extends AnyTypeConstraint>(
    value: unknown,
    schema: TSchema,
): type.infer<TSchema> {
    const res = schema(value);

    if (res instanceof type.errors) {
        throw new TypeError(res.summary);
    }
    return res;
}

// TODO: not sure that there is an async model in ArkType (where Zod has one)
// so will have to see if these can have a meaningful implementation
 
export const parseAsync = async <TSchema extends AnyTypeConstraint>(
    value: unknown,
    schema: TSchema,
    // eslint-disable-next-line  @typescript-eslint/require-await -- We currently fake the async-ness of this, but will be investigating if there is a proper way to do it
): Promise<type.infer<TSchema>> => {
    return parse(value, schema);
};

export const safeParseAsync = async <TSchema extends AnyTypeConstraint>(
    value: unknown,
    schema: TSchema,
    // eslint-disable-next-line  @typescript-eslint/require-await -- We currently fake the async-ness of this, but will be investigating if there is a proper way to do it
): Promise<SafeParseResult<TSchema>> => {
    return safeParse(value, schema);
};
