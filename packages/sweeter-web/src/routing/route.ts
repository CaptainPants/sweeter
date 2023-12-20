import type {
    ArgumentMatcher,
    PathTemplate,
    ResultTupleFromSegmentMatcherTuple,
} from './types.js';

 
export function route<
    const TSegmentMatcherTuple extends readonly ArgumentMatcher[],
>(
    template: TemplateStringsArray,
    ...args: [...TSegmentMatcherTuple]
): PathTemplate<TSegmentMatcherTuple> {
    const parts: (string | ArgumentMatcher)[] = [];

    const lastIndex = template.length - 1;

    for (let i = 0; i < lastIndex; ++i) {
        const constant = template[i]!;
        parts.push(constant);

        const argument = args[i];
        parts.push(argument);
    }

    if (lastIndex >= 0) {
        const lastConstant = template[lastIndex]!;
        if (lastConstant !== '') {
            parts.push(lastConstant);
        }
    }

    return new PathTemplateImplementation(parts);
}

class PathTemplateImplementation<
    const TSegmentMatcherTuple extends readonly ArgumentMatcher[],
> implements PathTemplate<TSegmentMatcherTuple>
{
    #parts: (string | ArgumentMatcher)[];

    constructor(parts: (string | ArgumentMatcher)[]) {
        this.#parts = parts;
    }

    match(
        input: string,
    ): ResultTupleFromSegmentMatcherTuple<TSegmentMatcherTuple> | undefined {
        let inputIndex = 0;
        let partIndex = 0;
        const matches: string[] = [];

        while (inputIndex < input.length && partIndex < this.#parts.length) {
            const part = this.#parts[partIndex]!;
            let matchLength: number | undefined;

            // Constant string match
            if (typeof part === 'string') {
                matchLength = this.matchString(input, inputIndex, part)
                    ? part.length
                    : undefined;

                if (matchLength === undefined) {
                    return undefined;
                }

                // ignore the actual match
            }
            // Parameter matcher
            else {
                matchLength = part.match(input, inputIndex);

                if (matchLength == undefined) {
                    return;
                } else {
                    matches.push(
                        input.substring(inputIndex, inputIndex + matchLength),
                    );
                }
            }

            inputIndex += matchLength;
            partIndex += 1;
        }

        if (partIndex < this.#parts.length || inputIndex < input.length) {
            return undefined;
        }

        // Too complicated for typescript to follow
        return matches as ResultTupleFromSegmentMatcherTuple<TSegmentMatcherTuple>;
    }

    matchString(
        input: string,
        startIndex: number,
        matchAgainst: string,
    ): boolean {
        for (let offset = 0; offset < matchAgainst.length; ++offset) {
            if (
                getNormalizedCharCode(input, startIndex + offset) !==
                getNormalizedCharCode(matchAgainst, offset)
            ) {
                return false;
            }
        }

        return true;
    }
}

function getNormalizedCharCode(input: string, index: number) {
    let code = input.charCodeAt(index);

    if (code >= 65 && code <= 90) {
        code = 97 + (code - 65);
    }

    return code;
}
