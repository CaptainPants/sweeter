/**
 * Borrowed from https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 *
 * You generally DO NOT want to do this, but its useful to us for using interface merging to create one big intersection type.
 */
export type UnionToIntersection<U> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void
        ? I
        : never;
