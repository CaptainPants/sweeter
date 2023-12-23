import { type ArgumentMatcher } from '../types.js';

const slash = '/'.charCodeAt(0);

export class SinglePartMatcher implements ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined {
        let i = startIndex;

        for (; i < input.length; ++i) {
            // END
            if (input.charCodeAt(i) === slash) {
                break; // Zero characters matched
            }
        }

        if (i !== startIndex) {
            // Non-zero-length match
            return i - startIndex;
        }

        return undefined;
    }
}
