import { type AbstractGlobalCssStylesheet } from '../types.js';

export function getTransitiveReferences(
    stylesheet: AbstractGlobalCssStylesheet,
) {
    const sheets: AbstractGlobalCssStylesheet[] = [stylesheet];

    const referenced = new Set([stylesheet]);

    // Recursively add referenced sheets
    for (let i = 0; i < sheets.length; ++i) {
        const current = sheets[i]!;

        const references = current.getReferencedStylesheets();
        if (references) {
            for (const currentReference of references) {
                if (!referenced.has(currentReference)) {
                    sheets.push(currentReference);
                    referenced.add(currentReference);
                }
            }
        }
    }

    return sheets;
}
