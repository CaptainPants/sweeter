import { type ArgumentMatcher } from '../types.js';

export class RestMatcher implements ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined {
        if (startIndex >= input.length) {
            return 0;
        }

        return input.length - startIndex;
    }
}
