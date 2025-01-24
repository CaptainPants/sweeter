import { type StylesheetContentGenerator } from './types.js';

export function isStylesheetContentGenerator(
    value: unknown,
): value is StylesheetContentGenerator {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as StylesheetContentGenerator).generate === 'function' &&
        typeof (value as StylesheetContentGenerator)
            .getReferencedStylesheets === 'function'
    );
}
