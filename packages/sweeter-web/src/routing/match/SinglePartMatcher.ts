import { type ArgumentMatcher } from '../types.js';

const slash = '/'.charCodeAt(0);

export class SinglePartMatcher implements ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined {
        for (let i = startIndex; i < input.length; ++i) {
            // END
            if (input.charCodeAt(i) === slash) {
                if (i !== startIndex) {
                    // Non-zero-length match
                    return i - startIndex;
                }

                return; // Zero characters matched
            }
        }

        return;
    }
}
