import { type ValidationSingleResult } from './types.js';

export function joinSingleValidationResults(
    results: readonly ValidationSingleResult[] | null,
): string {
    if (!results) return '';
    return results.map((x) => x.message).join(' ');
}
