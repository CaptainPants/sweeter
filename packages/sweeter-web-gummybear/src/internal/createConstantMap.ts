export function createConstantMap<
    const TKeys extends readonly (string | number | symbol)[],
    TValues,
>(keys: TKeys, callback: (key: TKeys[number], index: number) => TValues) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: { [Key in TKeys[number]]: TValues } = {} as any;

    let index = 0;
    for (const key of keys) {
        result[key as TKeys[number]] = callback(key, index);
        ++index;
    }

    return result;
}
