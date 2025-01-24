export type OptionalProperties<T> = { [Key in keyof T]?: T[Key] };

export type FixedPropertyType<T, TKey> = TKey extends keyof T
    ? T[TKey]
    : unknown;

export type ExpandoPropertyType<T> =
    T extends Record<string, infer S> ? S : unknown;
