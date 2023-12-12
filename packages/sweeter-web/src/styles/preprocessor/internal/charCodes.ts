export function charCodes(str: string): ReadonlyArray<number> {
    const res: number[] = [];
    for (let i = 0; i < str.length; ++i) {
        res.push(str.charCodeAt(i));
    }
    return res;
}

export const colonCharCodeArray = charCodes(':');
export const parensOrCloseParensCharCodeArray = charCodes('()');
export const doubleQuotesCharCodeArray = charCodes("'");
export const singleQuotesCharCodeArray = charCodes('"');

export const braceCharCodeArray = charCodes('{');
export const semiOrBraceCharCodeArray = charCodes('{;');
export const semiOrCloseBraceCharCodeArray = charCodes('};');

export const whitespaceCharCodeArray = charCodes(' \t\n\r\v');

export const colonOrBraceOrCloseBraceCharCodeArray = charCodes(':{}');

export const commaOrOpenParensOrOpenBracesCharCodeArray = charCodes(',({');

export const openBraceCharCode = '{'.charCodeAt(0);

export const forwardSlashCharCode = '/'.charCodeAt(0);
export const starCharCode = '*'.charCodeAt(0);

export const endMultilineComment = charCodes('*/');
export const endSinglelineComment = charCodes('\n');
