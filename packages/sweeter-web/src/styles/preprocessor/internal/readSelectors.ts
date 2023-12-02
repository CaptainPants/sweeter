import { commaOrOpenParensOrOpenBracesCharCodeArray, doubleQuotesCharCodeArray, parensOrCloseParensCharCodeArray, singleQuotesCharCodeArray } from './charCodes.js';
import { indexOfAny } from './indexOfAny.js';

export function readSelectors(input: string, startFromOffset: number): { selectors: string[], endOffset: number } {
    const selectors: string[] = [];

    let current: string[] = [];

    let nestingParenthesesCount = 0;
    let insideQuotes: 'single' | 'double' | undefined;

    let index = startFromOffset;

    for (;;) {
        const lookFor = insideQuotes === 'single' ? singleQuotesCharCodeArray
            : insideQuotes === 'double' ? doubleQuotesCharCodeArray 
            : nestingParenthesesCount > 0 ? parensOrCloseParensCharCodeArray 
            : commaOrOpenParensOrOpenBracesCharCodeArray;

        // might already be off the end, but thats ok
        const matchOffset = indexOfAny(
            lookFor,
            input,
            index,
        );

        // We've hit the end of the input
        if (matchOffset === undefined) {
            current.push(input.substring(index));
            if (current.length > 0) {
                selectors.push(current.join('').trim());
            }
            return { selectors, endOffset: input.length };
        }

        const match = input[matchOffset];

        if (insideQuotes) {
            // Assume that this is the end quotes
            current.push(input.substring(index, matchOffset) + 1); // store everything up to and including the '

            // toggle quotes off
            insideQuotes = undefined;
        }
        else {
            if (match === '{') {
                current.push(input.substring(index, matchOffset));
                if (current.length > 0) {
                    selectors.push(current.join('').trim());
                }
                return { selectors: selectors, endOffset: matchOffset };
            }
            else if (match === "'") {
                current.push(input.substring(index, matchOffset) + 1); // store everything up to and including the '
    
                // toggle quotes off
                insideQuotes = 'single';
            }  
            else if (match === '"') {
                current.push(input.substring(index, matchOffset) + 1); // store everything up to and including the "
    
                // toggle quotes off
                insideQuotes = 'double';
            }
            else if (match === '(') {
                current.push(input.substring(index, matchOffset + 1)); // store everything up to and including the (
    
                ++nestingParenthesesCount;
            } 
            else if (match === ')') {
                current.push(input.substring(index, matchOffset + 1)); // store everything up to and including the )
    
                --nestingParenthesesCount;
            }
            else if (match === ',') {
                current.push(input.substring(index, matchOffset)); // store everything up to the ,
                selectors.push(current.join('').trim());
    
                current = []; // reset 'current'
            } 
            else {
                throw new Error('This is probably a bug.');
            }
        }
        

        index = matchOffset + 1;
    }
}
