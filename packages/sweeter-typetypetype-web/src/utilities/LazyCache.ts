export class LazyCache<TKey extends object, TValue> {
    constructor(factory: (key: TKey) => TValue) {
        this.#factory = factory;
        this.#values = new WeakMap();
    }

    #factory: (key: TKey) => TValue;
    #values: WeakMap<TKey, { val: TValue }>;

    get(key: TKey): TValue {
        let found = this.#values.get(key);
        if (!found) {
            found = {
                val: this.#factory(key),
            };
        }

        return found.val;
    }
}
