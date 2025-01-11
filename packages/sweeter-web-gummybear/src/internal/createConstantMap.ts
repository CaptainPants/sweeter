export type ConstantMap<TKeys extends readonly (string | symbol)[], TValues> = {
    [Key in TKeys[number]]: TValues;
};

export function createConstantMap<
    const TKeys extends readonly (string | symbol)[],
    TValues,
>(keys: TKeys, callback: (key: TKeys[number], index: number) => TValues) {
    const result: ConstantMap<TKeys, TValues> = {} as ConstantMap<
        TKeys,
        TValues
    >;

    let index = 0;
    for (const key of keys) {
        result[key as TKeys[number]] = callback(key, index);
        ++index;
    }

    return result;
}
