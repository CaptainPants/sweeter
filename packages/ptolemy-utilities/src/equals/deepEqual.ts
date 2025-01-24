type Obj = Record<string | symbol, undefined>;

export function deepEqual(a: unknown, b: unknown): boolean {
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }

        return (
            a.length === b.length &&
            a.every((aItem, i): boolean => {
                return deepEqual(aItem, b[i]);
            })
        );
    }

    if (typeof a === 'object') {
        if (typeof b !== 'object') {
            return false;
        }

        if (a === null || b === null) {
            return a === b;
        }

        if (a instanceof Date) {
            if (!(b instanceof Date)) {
                return false;
            }

            // Bizarrely "getTime()" gets number of minutes since the epoch Midnight 1 Jan 1970
            return a.getTime() === b.getTime();
        }

        const aKeys = keys(a);
        const bKeys = keys(b);

        if (!deepEqual(aKeys, bKeys)) {
            return false;
        }

        return aKeys.every((key) =>
            deepEqual((a as Obj)[key], (b as Obj)[key]),
        );
    }

    // simple types
    return a === b;
}

function keys(obj: object): readonly (string | symbol)[] {
    const res: (string | symbol)[] = [];

    for (; obj; ) {
        for (const name of Object.getOwnPropertyNames(obj)) {
            res.push(name);
        }
        for (const symbol of Object.getOwnPropertySymbols(obj)) {
            res.push(symbol);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        obj = Object.getPrototypeOf(obj);
    }

    res.sort();

    return res;
}
