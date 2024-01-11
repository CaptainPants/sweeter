export class ImmutableLazyCache<
    TKey extends object,
    TValue,
    TAdditionalInfo extends readonly unknown[] = [],
> {
    constructor(
        factory: (key: TKey, ...additional: TAdditionalInfo) => TValue,
    ) {
        this.#factory = factory;
        this.#values = new WeakMap();
    }

    #factory: (key: TKey, ...additional: TAdditionalInfo) => TValue;
    #values: WeakMap<TKey, { val: TValue }>;

    get(key: TKey, ...additional: TAdditionalInfo): TValue {
        let found = this.#values.get(key);
        if (!found) {
            found = {
                val: this.#factory(key, ...additional),
            };
        }

        return found.val;
    }
}
