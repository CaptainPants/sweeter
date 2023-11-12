
const commaOrParens = [',', '('] as const;
const parensOrCloseParens = ['(', ')'] as const;

export function splitByUnparenthesizedCommas(content: string): string[] {
    const result: string[] = [];

    let current: string[] = [];
    let offset = 0;
    let nestingCount = 0;

    for (; ;)
    {
        // might already be off the end, but thats ok
        const matchOffset = findOneOf(nestingCount > 0 ? parensOrCloseParens : commaOrParens, content, offset);
        
        if (matchOffset === undefined) {
            current.push(content.substring(offset));
            result.push(current.join(''));
            return result;
        }

        const match = content[matchOffset];

        if (match === '(') {
            current.push(content.substring(offset, matchOffset + 1)); // store everything up to and including the (
                
            ++nestingCount;
        }
        else if (match === ')') {
            current.push(content.substring(offset, matchOffset + 1)); // store everything up to and including the )
            
            --nestingCount;
        }
        else if (match === ',') {
            current.push(content.substring(offset, matchOffset)); // store everything up to the comma
            result.push(current.join(''));
            
            current = []; // reset 'current'
        }
        else {
            throw new Error("This is probably a bug.");
        }
        offset = matchOffset + 1;
    }
}

function findOneOf(oneOf: readonly string[], within: string, offset: number): number | undefined {
    for (let index = offset; index < within.length; ++index) {
        const current = within[index]!;
        const foundIndex = oneOf.indexOf(current);
        
        if (foundIndex >= 0) {
            return index;
        }
    }
    return undefined;
}