
export function newlinesBetween(code: string, start: number, end: number): number {
    let counter = 0;
    for (let i = start; i < end; ++i) {
        if (code[i] === '\n') ++counter;
    }
    return counter;
}