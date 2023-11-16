import { indexOfAny } from './indexOfAny.js';

const commaOrParens = [','.charCodeAt(0), '('.charCodeAt(0)] as const;
const parensOrCloseParens = ['('.charCodeAt(0), ')'.charCodeAt(0)] as const;

export function splitByUnparenthesizedCommas(content: string): string[] {
    const result: string[] = [];

    let current: string[] = [];
    let offset = 0;
    let nestingCount = 0;

    for (;;) {
        // might already be off the end, but thats ok
        const matchOffset = indexOfAny(
            nestingCount > 0 ? parensOrCloseParens : commaOrParens,
            content,
            offset,
        );

        if (matchOffset === undefined) {
            current.push(content.substring(offset));
            result.push(current.join('').trim());
            return result;
        }

        const match = content[matchOffset];

        if (match === '(') {
            current.push(content.substring(offset, matchOffset + 1)); // store everything up to and including the (

            ++nestingCount;
        } else if (match === ')') {
            current.push(content.substring(offset, matchOffset + 1)); // store everything up to and including the )

            --nestingCount;
        } else if (match === ',') {
            current.push(content.substring(offset, matchOffset)); // store everything up to the comma
            result.push(current.join('').trim());

            current = []; // reset 'current'
        } else {
            throw new Error('This is probably a bug.');
        }
        offset = matchOffset + 1;
    }
}
