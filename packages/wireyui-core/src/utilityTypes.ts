// === START ===

// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir

export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X
    ? 1
    : 2) extends <T>() => T extends Y ? 1 : 2
    ? A
    : B;

export type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<
        { [Q in P]: T[P] },
        { -readonly [Q in P]: T[P] },
        P
    >;
}[keyof T];

export type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<
        { [Q in P]: T[P] },
        { -readonly [Q in P]: T[P] },
        never,
        P
    >;
}[keyof T];

export type OnlyWritableProperties<T> = Pick<T, WritableKeys<T>>;

// === END ===

/**
 * https://stackoverflow.com/questions/56863875/typescript-how-do-you-filter-a-types-properties-to-those-of-a-certain-type
 */
export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
