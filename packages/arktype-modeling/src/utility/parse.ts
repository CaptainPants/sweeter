import { type ArkErrors, type } from 'arktype';
import { type AnyTypeConstraint } from '../type/index.js';

export type SafeParseResult<TArkType extends AnyTypeConstraint> =
    | { success: true; data: type.infer<TArkType> }
    | { success: false; summary: string; issues: ArkErrors };

export function safeParse<TArkType extends AnyTypeConstraint>(
    value: unknown,
    schema: TArkType,
): SafeParseResult<TArkType> {
    const res = schema(value);

    if (res instanceof type.errors) {
        return { success: false, summary: res.summary, issues: res.issues };
    }
    return { success: true, data: value as type.infer<TArkType> };
}

export function parse<TSchema extends AnyTypeConstraint>(
    value: unknown,
    schema: TSchema,
): type.infer<TSchema> {
    const res = schema(value);

    if (res instanceof type.errors) {
        throw new TypeError(res.summary);
    }
    return res as type.infer<TSchema>;
}

// TODO: not sure that there is an async model in ArkType (where Zod has one)
// so will have to see if these can have a meaningful implementation
export const parseAsync = (
    ...args: Parameters<typeof parse>
): Promise<ReturnType<typeof parse>> => {
    try {
        return Promise.resolve(parse(...args));
    } catch (err) {
        return Promise.reject(err);
    }
};

export const safeParseAsync = (
    ...args: Parameters<typeof safeParse>
): Promise<ReturnType<typeof safeParse>> => {
    try {
        return Promise.resolve(safeParse(...args));
    } catch (err) {
        return Promise.reject(err);
    }
};
