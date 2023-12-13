export function getCharCodes(str: string): ReadonlyArray<number> {
    const res: number[] = [];
    for (let i = 0; i < str.length; ++i) {
        res.push(str.charCodeAt(i));
    }
    return res;
}

export const parensOrCloseParensCharCodeArray = getCharCodes('()');
export const doubleQuotesCharCodeArray = getCharCodes("'");
export const singleQuotesCharCodeArray = getCharCodes('"');

export const semiOrBraceCharCodeArray = getCharCodes('{;');
export const semiOrCloseBraceCharCodeArray = getCharCodes('};');

export const whitespaceCharCodeArray = getCharCodes(' \t\n\r\v');

export const commaOrOpenParensOrOpenBracesCharCodeArray = getCharCodes(',({');

export const endMultilineComment = getCharCodes('*/');
export const endSinglelineComment = getCharCodes('\n');

export const charCodes = {
    openBrace: '{'.charCodeAt(0),
    
    openBracket: '('.charCodeAt(0),
    closeBracket: ')'.charCodeAt(0),
    
    comma: ','.charCodeAt(0),
    colon: ':'.charCodeAt(0),
    semicolon: ';'.charCodeAt(0),
    
    forwardSlash: '/'.charCodeAt(0),
    star: '*'.charCodeAt(0),

    singleQuote: '\''.charCodeAt(0),
    doubleQuote: '"'.charCodeAt(0),
}
