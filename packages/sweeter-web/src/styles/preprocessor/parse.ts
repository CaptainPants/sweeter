import {
    charCodes,
    endMultilineComment,
    endSinglelineComment,
    semiOrBraceCharCodeArray,
    semiOrCloseBraceCharCodeArray,
    whitespaceCharCodeArray,
} from './internal/charCodes.js';
import { indexOfAny } from './internal/indexOfAny.js';
import type {
    AtRuleAstNode,
    PropertyAstNode,
    RuleAstNode,
    RuleBodyParts,
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
export function parseClassContent(css: string): RuleBodyParts {
    const parser = new Parser(css);
    return parser.parseRuleBodyContent(true);
}

const identifierRegExp = /^-{0,2}[_a-zA-Z]+[_a-zA-Z0-9-]*/g;

class Parser {
    constructor(input: string) {
        this.#input = input;
        this.#index = 0;
    }

    #input: string;
    #index: number;

    public parse(): RuleOrAtRule[] {
        const { nestedRules } = this.parseRuleBodyContent(false);
        return nestedRules;
    }

    #parseRuleOrAtRule(inBlock: boolean): RuleOrAtRule | undefined {
        this.#consumeWhitespaceAndComments();

        const next = this.#input.charCodeAt(this.#index);

        if (this.#index >= this.#input.length) {
            return undefined;
        }

        // End of the containing block
        if (next === charCodes.closeBrace) {
            if (inBlock) {
                // move #index past the block
                this.#moveNext();
                return undefined;
            } else {
                throw new Error(this.#errorMessage('Unexpected'));
            }
            // @rule
        } else if (next === charCodes.at) {
            return this.#parseAtRule();
            // normal selector rule: a.x#banana[test=1], b { }
        } else {
            return this.#parseRule();
        }
    }

    #parseRule(): RuleAstNode {
        const selectors = this.#parseSelectors();

        // '{'
        this.#expectAndMoveNext(charCodes.openBrace);

        const { nestedRules, properties } = this.parseRuleBodyContent(true);

        return {
            $nodeType: 'rule',
            selectors,
            nestedRules,
            properties,
        };
    }

    #parseSelectors(): string[] { 
        this.#consumeWhitespaceAndComments();

        let bracketCount = 0;
        let currentResult: number[] = [];
        const result: string[] = [];

        while (this.#index < this.#input.length) {
            // We should NOT be seeing any comments here, as #consumeWhitespaceAndComments() 
            // or #moveNext() have been called and they should exhaustively skip any comments.
            
            const current = this.#input.charCodeAt(this.#index);

            // EXIT We have hit the open brace for the properties in the current rule
            if (current === charCodes.openBrace) {
                break;
            }

            if (current === charCodes.singleQuote || current === charCodes.doubleQuote) {
                this.#readQuotedStringInto(currentResult);
                continue;
            }

            if (bracketCount === 0 && current === charCodes.comma) {
                result.push(String.fromCharCode(...currentResult).trim());
                currentResult = [];
                // this means we're onto the next selector
            }
            else {
                // Normal case: treat the value as valid content
                currentResult.push(current);

                // Open brackets, means we handle commas differently
                if (current === charCodes.openBracket) {
                    ++bracketCount;
                }
                else if (current === charCodes.closeBracket) {
                    --bracketCount;
                }
            }

            this.#moveNext();
        }

        if (currentResult.length > 0) {
            result.push(String.fromCharCode(...currentResult).trim());
        }
        if (result.length === 0) {
            throw new Error(this.#errorMessage('No selectors found'));
        }
        return result;
    }

    /**
     * Assumes (and does not check) that #index points to a " or a ', so really will 
     * treat whatever character is passed as the delimiter.
     * @param output 
     */
    #readQuotedStringInto(output: number[]): void {
        const quoteChar = this.#input.charCodeAt(this.#index);

        output.push(quoteChar);

        this.#moveNext();

        while (this.#index < this.#input.length) {
            const current = this.#input.charCodeAt(this.#index);

            output.push(current);

            this.#moveNext();

            if (current === quoteChar) {
                return; // Stop after the next quote char
            }
        }
    }

    /**
     * Positions the #index at the next index on completion
     *
     * TODO: doesn't handle comments.
     * @returns
     */
    #parseAtRule(): AtRuleAstNode {
        this.#moveNext(); // move past @
        
        const type = this.#tryReadIdent();
        if (type === undefined) {
            throw new Error(this.#errorMessage('Expected an identifier'));
        }

        this.#consumeWhitespaceAndComments();

        // The opening line must end with a ; or a {
        const foundIndex = indexOfAny(
            semiOrBraceCharCodeArray,
            this.#input,
            this.#index,
        );
        if (foundIndex === undefined)
            throw new Error(
                this.#errorMessage('Could not find end of @ rule preamble as.'),
            );

        let parameters: string | undefined = this.#input
            .substring(this.#index, foundIndex)
            .trim();
        if (!parameters) {
            parameters = undefined;
        }

        const whatDidWeFind = this.#input[foundIndex]!;

        // position after the ; or {
        this.#index = foundIndex + 1;

        if (whatDidWeFind === ';') {
            return {
                $nodeType: 'at',
                type: type,
                parameters,
            };
        } else {
            // position at start of block (after the brace)
            this.#index = foundIndex + 1;
            const { properties, nestedRules } = this.parseRuleBodyContent(true);

            return {
                $nodeType: 'at',
                type,
                parameters,
                properties,
                nestedRules,
            };
        }
    }

    /**
     * Expects #index to be pointing to the firat character in the block (after the {)
     * Positions the #index after the closing brace (or end of file) on completion
     */
    parseRuleBodyContent(allowProperties: boolean): RuleBodyParts {
        const nestedRules: RuleOrAtRule[] = [];
        const properties: PropertyAstNode[] = [];

        while (this.#index < this.#input.length) {
            this.#consumeWhitespaceAndComments();

            if (this.#input[this.#index] === '}') {
                this.#moveNext();
                break;
            }

            const propertyName = this.#tryParsePropertyNameAndColon();

            // property
            if (propertyName) {
                if (!allowProperties) {
                    throw new Error('Found property when not allowed.');
                }

                this.#consumeWhitespaceAndComments();
                const propertyValue = this.#readPropertyValue();
                this.#moveNext();

                properties.push({
                    $nodeType: 'property',
                    name: propertyName,
                    value: propertyValue,
                });
            }
            // nested rule / at-rule
            else {
                const nestedRule = this.#parseRuleOrAtRule(true); // positions #index at the next character

                if (nestedRule) {
                    nestedRules.push(nestedRule);
                }
            }
        }

        return { nestedRules, properties };
    }

    /**
     * Read a property name and the following colon.
     * @returns
     */
    #tryParsePropertyNameAndColon(): string | undefined {
        const startOfIdentifierIndex = this.#index;

        const remaining = this.#input.substring(this.#index);
        const match = remaining.match(identifierRegExp);

        if (match) {
            const len = match[0].length;

            // Skip to end of identifier match, store this for later
            const endOfPropertyName = startOfIdentifierIndex + len;
            this.#index = endOfPropertyName;

            // TODO: not sure if comments are allowed between property and colon, but they PROBABLY are?
            this.#consumeWhitespaceAndComments();

            // If there is a following colon then this IS a property
            if (this.#input.charCodeAt(this.#index) === charCodes.colon) {
                this.#moveNext();

                return this.#input.substring(
                    startOfIdentifierIndex,
                    endOfPropertyName,
                );
            }

            // Reset
            this.#index = startOfIdentifierIndex;
        }

        return undefined;
    }

    #readPropertyValue(): string { 
        this.#consumeWhitespaceAndComments();

        const result: number[] = [];

        while (this.#index < this.#input.length) {
            // We should NOT be seeing any comments here, as #consumeWhitespaceAndComments() 
            // or #moveNext() have been called and they should exhaustively skip any comments.
            
            const current = this.#input.charCodeAt(this.#index);

            // EXIT We have hit the ending ; for the property value
            if (current === charCodes.semicolon) {
                this.#moveNext(); // Remove the semicolon
                break;
            }

            if (current === charCodes.singleQuote || current === charCodes.doubleQuote) {
                this.#readQuotedStringInto(result);
                continue;
            }

            // Normal case: treat the value as valid content
            result.push(current);

            this.#moveNext();
        }

        if (result.length === 0) {
            throw new Error(this.#errorMessage('No selectors found'));
        }

        return String.fromCharCode(...result);
    }

    #tryReadIdent(): string | undefined {
        const remaining = this.#input.substring(this.#index);
        const match = remaining.match(identifierRegExp);

        if (match) {
            const len = match[0].length;
            this.#index += len;
            return match[0];
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
            let countBackwardsIndex = Math.min(
                this.#index,
                this.#input.length - 1,
            );
            countBackwardsIndex >= 0;
            --countBackwardsIndex
        ) {
            if (this.#input[countBackwardsIndex]!.match(/^\r?\n/g)) {
                break;
            }

            ++columnIndex;
        }

        return `At index ${this.#index} (line: ${lineNumber + 1}, column: ${
            columnIndex + 1
        }) [${this.getIndexContextString()}]: ${message}`;
    }

    /**
     * Position #index at the next non-whitespace character,
     * ignoring any comments on the way through.
     */
    #consumeWhitespaceAndComments(): void {
        while (this.#index < this.#input.length) {
            if (
                whitespaceCharCodeArray.includes(
                    this.#input.charCodeAt(this.#index),
                )
            ) {
                ++this.#index;
            } else {
                if (!this.#skipComments()) {
                    return;
                }
            }
        }
    }

    /**
     * Move to the next character, skipping any comments
     */
    #moveNext(): void {
        this.#index += 1;
        this.#skipComments();
    }

    /**
     * Assert that the current character matches the provided code (skipping a comment
     * if we are accidentally pointing at a comment).
     *
     * Then move to the next character, skipping any comments.
     */
    #expectAndMoveNext(code: number): void {
        // TODO: not sure if this is needed
        this.#skipComments();

        if (this.#input.charCodeAt(this.#index) !== code) {
            throw new Error(
                this.#errorMessage(
                    `Expected ${String.fromCharCode(code)} but instead found ${
                        this.#input[this.#index]
                    }.`,
                ),
            );
        }

        this.#index += 1;
        this.#skipComments();
    }

    /**
     * Skip any comments at the current this.#index.
     * @returns
     */
    #skipComments(): boolean {
        const skipOneComment = (): boolean => {
            if (this.#input.charCodeAt(this.#index) !== charCodes.forwardSlash) {
                return false;
            }

            const next = this.#input.charCodeAt(this.#index + 1);
            if (next === charCodes.forwardSlash) {
                // Single line comment
                const end = this.#findSequence(
                    this.#input,
                    this.#index,
                    endSinglelineComment,
                );
                if (end !== undefined) {
                    this.#index = end + endSinglelineComment.length;
                    return true;
                }
            } else if (next === charCodes.star) {
                // Multiline comment
                const end = this.#findSequence(
                    this.#input,
                    this.#index,
                    endMultilineComment,
                );
                if (end !== undefined) {
                    this.#index = end + endMultilineComment.length;
                    return true;
                }
            }

            return false;
        };

        let result = false;
        while (skipOneComment()) {
            result = true;
        }
        return result;
    }

    /**
     * Find the next instance of a specified sequence of character codes in
     * the parameter 'str'. Used mostly for processing comments.
     * @param str
     * @param offset
     * @param seq
     * @returns
     */
    #findSequence(
        str: string,
        offset: number,
        seq: readonly number[],
    ): number | undefined {
        outer: for (let i = offset; i < str.length; ++i) {
            for (let seqOffset = 0; seqOffset < seq.length; ++seqOffset) {
                if (str.charCodeAt(i + seqOffset) !== seq[seqOffset]) {
                    continue outer; // not a match, continue with next offset
                }
            }
            return i;
        }
        return undefined;
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

        const result = `${this.#input.substring(from, this.#index)} <|${
            this.#input[this.#index]
        }|> ${this.#input.substring(this.#index + 1, to)}${
            atEnd ? ' EOF' : ''
        }`;

        return result;
    }
}
