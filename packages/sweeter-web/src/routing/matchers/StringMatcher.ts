import { type PartMatcherContext, type PartMatcher } from "../types.js";

const slash = '/'.charCodeAt(0);

export class StringMatcher implements PartMatcher<string> {
    matches(input: string, startIndex: number, context: PartMatcherContext<string>): void {
        context.matches = false;
        context.matchLength = undefined;
        context.result = undefined;

        for (let i = startIndex; i < input.length; ++i) {
            // END
            if (input.charCodeAt(i) === slash) {
                if (i !== startIndex) {
                    // Non-zero-length match
                    context.matches = true;
                    context.matchLength = i - startIndex
                    context.result = input.substring(startIndex, i);
                    return;
                }

                return; // Zero characters matched
            }
        }

        return;
    }
}