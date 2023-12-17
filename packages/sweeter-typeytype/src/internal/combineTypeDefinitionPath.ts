export function combineTypeDefinitionPath(
    addToLeft: number | string,
    path: string | undefined,
): string {
    if (typeof addToLeft === 'number') {
        return `[${addToLeft}]` + (path ?? '');
    } else {
        if (path === undefined) {
            return addToLeft;
        }
        return addToLeft + '.' + path;
    }
}
