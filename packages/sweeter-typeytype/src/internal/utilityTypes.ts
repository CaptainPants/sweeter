/**
 * This is some true black magic: https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 * Which references https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
 * and https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
export type UnionToIntersection<U> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void
        ? I
        : never;

/**
 * This is not in use but is cool so keeping it around.
 */
export type TupleToIntersection<TArgs extends readonly unknown[]> =
    UnionToIntersection<TArgs[number]>;

// The brute force approach that also works:

// type TupleToIntersection<TArgs extends readonly unknown[]> = TArgs extends [infer Only]
//   ? Only
//   : TArgs extends [infer First, ...infer Rest]
//   ? First & Intersect<Rest>
//   : never;

type _GetExpandoTypeHelper<TObject> = {
    [TKey in keyof TObject as string extends TKey
        ? TKey
        : never]: TObject[TKey];
};
export type GetExpandoType<TObject> =
    _GetExpandoTypeHelper<TObject>[keyof _GetExpandoTypeHelper<TObject>];
