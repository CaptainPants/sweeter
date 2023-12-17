import { type ValidatorResult } from './types.js';

export async function flattenValidatorResultsToStrings(
    result: ValidatorResult | Promise<ValidatorResult>,
): Promise<string[]> {
    const awaited = await result;
    return awaited === null
        ? []
        : Array.isArray(awaited)
        ? awaited
        : [...awaited];
}
