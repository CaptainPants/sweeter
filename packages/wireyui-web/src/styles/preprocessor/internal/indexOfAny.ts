export function indexOfAny(
    oneOf: readonly number[],
    within: string,
    offset: number,
): number | undefined {
    for (let index = offset; index < within.length; ++index) {
        const current = within.charCodeAt(index);

        for (const toMatch of oneOf) {
            if (current === toMatch) {
                return index;
            }
        }
    }
    return undefined;
}
