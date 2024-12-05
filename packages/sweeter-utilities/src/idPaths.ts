export const idPaths = {
    index(path: string | undefined, index: number) {
        const added = String(index);
        if (!path) return added;
        return path + '_' + added;
    },
    key(path: string | undefined, key: string) {
        const added = key;
        if (!path) return added;
        return path + '_' + added;
    },
    union(path: string | undefined, index: number) {
        const added = `$${index}`;
        if (!path) return added;
        return path + '_' + added;
    },
    join(path: readonly (number | string | symbol)[]): string {
        return path
            .map((x) =>
                typeof x === 'symbol'
                    ? `Symbol(${JSON.stringify(x.description)})`
                    : x,
            )
            .join('.');
    },
};
