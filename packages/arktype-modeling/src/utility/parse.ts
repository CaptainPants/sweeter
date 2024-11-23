import { ArkErrors, type } from 'arktype';
import { AnyTypeConstraint } from '../type';

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

export function parse<TArkType extends AnyTypeConstraint>(
    value: unknown,
    schema: TArkType,
): type.infer<TArkType> {
    const res = schema(value);

    if (value instanceof type.errors) {
        throw new TypeError(value.summary);
    }
    return value as type.infer<TArkType>;
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
