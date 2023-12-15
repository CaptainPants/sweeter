import {
    charCodes,
    charCodeSequences,
    whitespaceCharCodes,
} from './internal/charCodes.js';
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

    #parseRuleOrAtRule(): RuleOrAtRule | undefined {
        this.#skipWhitespaceAndComments();

        const next = this.#input.charCodeAt(this.#index);

        if (this.#index >= this.#input.length) {
            return undefined;
        }

        // End of the containing block
        if (next === charCodes.closeBrace) {
            throw new Error(this.#errorMessage('Unexpected'));
        }
        // @rule
        else if (next === charCodes.at) {
            return this.#parseAtRule();
        }
        // normal selector rule: a.x#banana[test=1], b { }
        else {
            return this.#parseRule();
        }
    }

    #parseRule(): RuleAstNode {
        const selectors = this.#readSelectors();

        // '{'
        this.#expect(charCodes.openBrace);

        this.#moveNextSkippingWhitespaceAndComments();

        const { nestedRules, properties } = this.parseRuleBodyContent(true);

        return {
            $nodeType: 'rule',
            selectors,
            nestedRules,
            properties,
        };
    }

    #readSelectors(): string[] {
        this.#skipWhitespaceAndComments();

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

            if (
                current === charCodes.singleQuote ||
                current === charCodes.doubleQuote
            ) {
                this.#readQuotedStringInto(currentResult);
                continue;
            }

            // If its a comma (and we're not inside a nested selector/brackets) then add the
            // currentResult selector to the result set and start a new selector
            if (bracketCount === 0 && current === charCodes.comma) {
                result.push(String.fromCharCode(...currentResult).trim());
                currentResult = [];
                // this means we're onto the next selector
            } else {
                // Normal case: treat the value as valid content
                currentResult.push(current);

                // Open brackets, means we handle commas differently
                if (current === charCodes.openBracket) {
                    ++bracketCount;
                } else if (current === charCodes.closeBracket) {
                    --bracketCount;
                }
            }

            if (this.#moveNextSkippingWhitespaceAndComments()) {
                // If we skipped a comment/space, add a space (so that a/* test */:not(b) has a space in between)
                currentResult.push(charCodes.space);
            }
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
     * Positions the #index at the next index on completion
     * @returns
     */
    #parseAtRule(): AtRuleAstNode {
        this.#moveNextSkippingWhitespaceAndComments(); // move past @

        const type = this.#tryReadIdent();
        if (type === undefined) {
            throw new Error(this.#errorMessage('Expected an identifier'));
        }

        this.#skipWhitespaceAndComments();

        const parameters = this.#readAtRuleParameters();

        const openBraceOrSemiColon = this.#input.charCodeAt(this.#index);

        if (openBraceOrSemiColon === charCodes.semicolon) {
            this.#moveNextSkippingWhitespaceAndComments(); // move past the ;

            return {
                $nodeType: 'at',
                type: type,
                parameters,
            };
        } else if (openBraceOrSemiColon === charCodes.openBrace) {
            this.#moveNextSkippingWhitespaceAndComments(); // move past the {

            const { properties, nestedRules } = this.parseRuleBodyContent(true);

            return {
                $nodeType: 'at',
                type,
                parameters,
                properties,
                nestedRules,
            };
        } else {
            throw new Error(
                this.#errorMessage(
                    `Unexpected character ${String.fromCharCode(
                        openBraceOrSemiColon,
                    )}`,
                ),
            );
        }
    }

    #readAtRuleParameters(): string | undefined {
        this.#skipWhitespaceAndComments();

        const result: number[] = [];

        while (this.#index < this.#input.length) {
            // We should NOT be seeing any comments here, as #consumeWhitespaceAndComments()
            // or #moveNext() have been called and they should exhaustively skip any comments.

            const current = this.#input.charCodeAt(this.#index);

            // EXIT We have hit the ending ; for the property value
            if (
                current === charCodes.openBrace ||
                current === charCodes.semicolon
            ) {
                // DO NOT MOVE OFF THE { or ; as we need to determine which it was in the caller
                break;
            }

            if (
                current === charCodes.singleQuote ||
                current === charCodes.doubleQuote
            ) {
                this.#readQuotedStringInto(result);
                continue;
            }

            // Normal case: treat the value as valid content
            result.push(current);

            if (this.#moveNextSkippingWhitespaceAndComments()) {
                // If we skipped a comment/space, add a space (so that a/* test */:not(b) has a space in between)
                result.push(charCodes.space);
            }
        }

        if (result.length === 0) {
            return undefined;
        }

        return String.fromCharCode(...result).trim();
    }

    /**
     * Expects #index to be pointing to the firat character in the block (after the {)
     * Positions the #index after the closing brace (or end of file) on completion
     */
    parseRuleBodyContent(allowProperties: boolean): RuleBodyParts {
        const nestedRules: RuleOrAtRule[] = [];
        const properties: PropertyAstNode[] = [];

        while (this.#index < this.#input.length) {
            this.#skipWhitespaceAndComments();

            // We've hit the end of the block
            if (this.#input.charCodeAt(this.#index) === charCodes.closeBrace) {
                this.#moveNextSkippingWhitespaceAndComments();
                break;
            }

            const propertyName = this.#tryReadPropertyNameAndColon();

            // property
            if (propertyName) {
                if (!allowProperties) {
                    // This applies
                    throw new Error('Found property when not allowed.');
                }

                this.#skipWhitespaceAndComments();
                const propertyValue = this.#readPropertyValue();

                properties.push({
                    $nodeType: 'property',
                    name: propertyName,
                    value: propertyValue,
                });
            }
            // nested rule OR at-rule
            else {
                const nestedRule = this.#parseRuleOrAtRule(); // positions #index at the next character
                this.#moveNextSkippingWhitespaceAndComments;

                if (nestedRule) {
                    nestedRules.push(nestedRule);
                }
            }
        }

        return { nestedRules, properties };
    }

    /**
     * Read a property name and the following colon, which may fail e.g. if its actually an at rule or a rule
     * @returns
     */
    #tryReadPropertyNameAndColon(): string | undefined {
        const startOfIdentifierIndex = this.#index;

        const remaining = this.#input.substring(this.#index);
        const match = remaining.match(identifierRegExp);

        if (match) {
            const len = match[0].length;

            // Skip to end of identifier match, store this for later
            const endOfPropertyName = startOfIdentifierIndex + len;
            this.#index = endOfPropertyName;

            // TODO: not sure if comments are allowed between property and colon, but they PROBABLY are?
            this.#skipWhitespaceAndComments();

            // If there is a following colon then this IS a property
            if (this.#input.charCodeAt(this.#index) === charCodes.colon) {
                this.#moveNextSkippingWhitespaceAndComments();

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

    /**
     * Note that this will leave #index pointing after the end of the value (if semicolon present, then after that)
     * @returns
     */
    #readPropertyValue(): string {
        this.#skipWhitespaceAndComments();

        const result: number[] = [];

        while (this.#index < this.#input.length) {
            // We should NOT be seeing any comments here, as #consumeWhitespaceAndComments()
            // or #moveNext() have been called and they should exhaustively skip any comments.

            const current = this.#input.charCodeAt(this.#index);

            // EXIT We have hit the ending ; for the property value
            if (current === charCodes.semicolon) {
                this.#moveNextSkippingWhitespaceAndComments(); // move past semicolon
                break;
            }

            // EXIT We have hit the ending } for the current block (semicolons are 'delimiters' not 'terminators', so this is allowed)
            if (current === charCodes.closeBrace) {
                break;
            }

            if (
                current === charCodes.singleQuote ||
                current === charCodes.doubleQuote
            ) {
                this.#readQuotedStringInto(result);
                continue;
            }

            // Normal case: treat the value as valid content
            result.push(current);

            if (this.#moveNextSkippingWhitespaceAndComments()) {
                // If we skipped a comment/space, add a space (so that a/* test */:not(b) has a space in between)
                result.push(charCodes.space);
            }
        }

        if (result.length === 0) {
            throw new Error(this.#errorMessage('No selectors found'));
        }

        return String.fromCharCode(...result).trim();
    }

    /**
     * Assumes (and does not check) that #index points to a " or a ', so really will
     * treat whatever character is passed as the delimiter.
     * @param output
     */
    #readQuotedStringInto(output: number[]): void {
        const quoteChar = this.#input.charCodeAt(this.#index);

        output.push(quoteChar);

        this.#moveNextSkippingWhitespaceAndComments();

        while (this.#index < this.#input.length) {
            const current = this.#input.charCodeAt(this.#index);

            output.push(current);

            this.#moveNextSkippingWhitespaceAndComments();

            if (current === quoteChar) {
                return; // Stop after the next quote char
            }
        }
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
    #skipWhitespaceAndComments(): boolean {
        let skipped = false;
        while (this.#skipWhitespace() || this.#skipComments()) {
            // continuously call these two until one returns false.
            skipped = true;
        }
        return skipped;
    }

    /**
     * Move to the next character, skipping any comments or whitespace
     * @returns true if there was skipped comments or whitespace
     */
    #moveNextSkippingWhitespaceAndComments(): boolean {
        this.#index += 1;
        return this.#skipWhitespaceAndComments();
    }

    /**
     * Assert that the current character matches the provided code (skipping a comment
     * if we are accidentally pointing at a comment).
     *
     * Then move to the next character, skipping any comments.
     */
    #expect(code: number): void {
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
    }

    /**
     * Skip any comments at the current this.#index.
     * @returns
     */
    #skipWhitespace(): boolean {
        const savedIndex = this.#index;
        while (
            whitespaceCharCodes.includes(this.#input.charCodeAt(this.#index))
        ) {
            ++this.#index;
        }
        return savedIndex !== this.#index; // we skipped something
    }

    /**
     * Skip any comments at the current this.#index.
     * @returns
     */
    #skipComments(): boolean {
        const skipOneComment = (): boolean => {
            if (
                this.#input.charCodeAt(this.#index) !== charCodes.forwardSlash
            ) {
                return false;
            }

            const next = this.#input.charCodeAt(this.#index + 1);
            if (next === charCodes.forwardSlash) {
                // Single line comment
                const end = this.#findSequence(
                    this.#input,
                    this.#index,
                    charCodeSequences.endSinglelineComment,
                );
                if (end !== undefined) {
                    this.#index =
                        end + charCodeSequences.endSinglelineComment.length;
                    return true;
                }
            } else if (next === charCodes.star) {
                // Multiline comment
                const end = this.#findSequence(
                    this.#input,
                    this.#index,
                    charCodeSequences.endMultilineComment,
                );
                if (end !== undefined) {
                    this.#index =
                        end + charCodeSequences.endMultilineComment.length;
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
