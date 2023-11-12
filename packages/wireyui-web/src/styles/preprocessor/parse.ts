import { splitByUnparenthesizedCommas } from './internal/splitByUnparenthesizedCommas.js';
import type {
    AtRuleAstNode,
    NestedRuleOrProperty,
    RuleAstNode,
    RuleOrAtRule,
} from './types.js';

/**
 * Parse CSS content of a file
 * @param css 
 * @returns 
 */
export function parse(css: string): RuleOrAtRule[] {
    const parser = new Parser(css);
    return parser.parse();
}

/**
 * Parse CSS content of a class.
 * @param css 
 * @returns 
 */
export function parseClassContent(css: string): NestedRuleOrProperty[] {
    const parser = new Parser(css);
    return parser.parseRuleBodyContent();
}

const blockStart = ['{'] as const;
const semiOrBrace = ['{', ';'] as const;
const semiOrBraceOrCloseBrace = ['{', ';', '}'] as const;

const identifier = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;

class Parser {
    constructor(input: string) {
        this.#input = input;
        this.#index = 0;
    }

    #input: string;
    #index: number;

    public parse(): RuleOrAtRule[] {
        return this.#parseRuleOrAtRule(false);
    }

    #parseRuleOrAtRule(inBlock: boolean): RuleOrAtRule[] {
        const result: RuleOrAtRule[] = [];

        this.#skipWhiteSpace();

        while (this.#index < this.#input.length) {
            // whitespace should already have been skipped

            const next = this.#input[this.#index];
            if (next === '}') {
                if (inBlock) {
                    // move #index past the block
                    this.#index += 1;
                    break;
                } else {
                    throw new Error(this.#errorMessage('Unexpected'));
                }
            } else if (next === '@') {
                result.push(this.#parseAtRule());
            } else {
                result.push(this.#parseRule());
            }
            
            this.#skipWhiteSpace();
        }

        return result;
    }

    #parseRule(): RuleAstNode {
        // TODO: split rule selectors into a top level 'OR' based on commas (noting that selectors can have parenthesised sub-selectors e.g. :not())
        const startOfBody = this.#findOneOf(blockStart);
        if (!startOfBody) throw new Error(this.#errorMessage('No block body found'));

        const selectors = splitByUnparenthesizedCommas(this.#input.substring(this.#index, startOfBody));

        this.#index = startOfBody + 1;
        const body = this.parseRuleBodyContent();
        this.#index += 1;

        return {
            $type: 'rule',
            selectors: selectors,
            body: body
        }
    }

    /**
     * Positions the #index at the next index on completion
     * @returns 
     */
    #parseAtRule(): AtRuleAstNode {
        ++this.#index; // move past @
        const ident = this.#tryReadIdent();
        if (ident === undefined) {
            throw new Error(this.#errorMessage('Expected an identifier'));
        }

        this.#skipWhiteSpace();

        // The opening line must end with a ; or a {
        const foundIndex = this.#findOneOf(semiOrBrace);
        if (foundIndex === undefined)
            throw new Error(this.#errorMessage('Could not find end of @ rule preamble as.'));

        const parameters = this.#input.substring(
            this.#index,
            foundIndex,
        );

        const whatDidWeFind = this.#input[foundIndex]!;

        // position after the ; or {
        this.#index = foundIndex + 1;

        if (whatDidWeFind === ';') {
            return { $type: 'at', name: ident, parameters: parameters };
        } else {
            // position at start of block
            this.#index = foundIndex;
            const block = this.#parseRuleOrAtRule(true);

            return {
                $type: 'at',
                name: ident,
                parameters: parameters,
                body: block,
            };
        }
    }

    #tryReadIdent(): string | undefined {
        const remaining = this.#input.substring(this.#index);
        const match = remaining.match(identifier);
        if (match) {
            const len = match[0].length;
            this.#index += len;
            return match[0];
        }
        return undefined;
    }

    /**
     * Expects #index to be pointing to the firat character in the block (after the {) 
     * Positions the #index at the closing brace (or end of file) on completion
     */
    parseRuleBodyContent(): NestedRuleOrProperty[] {
        const result: NestedRuleOrProperty[] = [];

        while (this.#index < this.#input.length) {
            this.#skipWhiteSpace();

            if (this.#input[this.#index] === '}') {
                break;
            }

            const foundSemiOrBlockStartOrBlockEndIndex =
                this.#findOneOf(semiOrBraceOrCloseBrace);

            if (foundSemiOrBlockStartOrBlockEndIndex === undefined) {
                // I think this is really if the file ends during a rule
                const wholeProperty = this.#input.substring(this.#index);
                result.push({
                    $type: 'property',
                    content: wholeProperty,
                });
                this.#index = this.#input.length; // end of file
                break;
            }

            const which = this.#input[foundSemiOrBlockStartOrBlockEndIndex];

            // nested rule
            if (which === '{') {
                const nestedRule = this.#parseRule(); // positions #index at the next character
                result.push(nestedRule);
            } else {
                const wholeProperty = this.#input.substring(
                    this.#index,
                    foundSemiOrBlockStartOrBlockEndIndex,
                );
                result.push({
                    $type: 'property',
                    content: wholeProperty,
                });
                this.#index = foundSemiOrBlockStartOrBlockEndIndex + 1;
            }
        }
        
        return result;
    }

    /**
     * Position #index at the next non-whitespace character
     */
    #skipWhiteSpace(): void {
        while (
            this.#index < this.#input.length &&
            ' \t\n\r\v'.indexOf(this.#input[this.#index]!) >= 0
        ) {
            ++this.#index;
        }
    }

    /**
     * From #index find the first character in the provided array
     * @param oneOf 
     * @returns 
     */
    #findOneOf(oneOf: readonly string[]): number | undefined {
        for (let index = this.#index; index < this.#input.length; ++index) {
            const current = this.#input[index]!;
            const foundIndex = oneOf.indexOf(current);

            if (foundIndex >= 0) {
                return index;
            }
        }
        return undefined;
    }

    /**
     * Create an error object with useful positional information from #index
     * @param message 
     * @returns 
     */
    #errorMessage(message: string): string {
        const upToIndex = this.#input.substring(0, this.#index);

        const lineNumber = upToIndex.match(/\r?\n/g)?.length ?? 0;

        let columnIndex = 0;

        for (
            let countBackwardsIndex = Math.min(this.#index, this.#input.length - 1);
            countBackwardsIndex >= 0;
            --countBackwardsIndex
        ) {
            if (this.#input[countBackwardsIndex]!.match(/^\r?\n/g)) {
                break;
            }

            ++columnIndex;
        }

        return `At index ${
                this.#index
            } (line: ${lineNumber + 1}, column: ${columnIndex + 1}) [${this.getIndexContextString()}]: ${message}`;
    }

    toString() {
        return `${this.#index} -> ${this.getIndexContextString()}`;
    }

    getIndexContextString() {
        const numberOfCharsOnEitherSide = 20;

        const from = Math.max(this.#index - numberOfCharsOnEitherSide, 0);

        if (this.#index >= this.#input.length) {
            // this #index is already off the end, so there is no 'current'
            return `${this.#input.substring(from, this.#index)} EOF`;
        }

        let to = this.#index + numberOfCharsOnEitherSide + 1;
        let atEnd: boolean = false;

        if (to >= this.#input.length) {
            to = this.#input.length - 1;
            atEnd = true;
        }

        const result =  `${this.#input.substring(from, this.#index)} <|${this.#input[this.#index]}|> ${this.#input.substring(this.#index + 1, to)}${(atEnd ? ' EOF' : '')}`;

        return result;
    }
}
