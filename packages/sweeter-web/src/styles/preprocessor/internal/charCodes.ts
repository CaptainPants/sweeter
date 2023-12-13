export function getCharCodes(str: string): ReadonlyArray<number> {
    const res: number[] = [];
    for (let i = 0; i < str.length; ++i) {
        res.push(str.charCodeAt(i));
    }
    return res;
}

export const whitespaceCharCodes = getCharCodes(' \t\n\r\v');

export const charCodeSequences = {
    endMultilineComment: getCharCodes('*/'),
    endSinglelineComment: getCharCodes('\n'),
};

export const charCodes = {
    openBrace: '{'.charCodeAt(0),
    closeBrace: '}'.charCodeAt(0),
    at: '@'.charCodeAt(0),

    openBracket: '('.charCodeAt(0),
    closeBracket: ')'.charCodeAt(0),

    comma: ','.charCodeAt(0),
    colon: ':'.charCodeAt(0),
    semicolon: ';'.charCodeAt(0),

    forwardSlash: '/'.charCodeAt(0),
    star: '*'.charCodeAt(0),

    singleQuote: "'".charCodeAt(0),
    doubleQuote: '"'.charCodeAt(0),
};
