
export interface PartMatcherContext<T> {
    matches: boolean;
    matchLength: number | undefined;
    result: T | undefined;
}

export interface PartMatcher<T> {
    matches(input: string, startIndex: number, context: PartMatcherContext<T>): void;
}

export type TypeForPartMatcher<TPartMatcher> = TPartMatcher extends PartMatcher<infer S> ? S : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapTypeForPartMatcher<TPartMatcherTuple extends readonly PartMatcher<any>[]> = { [Key in keyof TPartMatcherTuple]: TypeForPartMatcher<TPartMatcherTuple[Key]> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Parameters = readonly PartMatcher<any>[];

export interface PathMatcher<TArguments extends Parameters> {
    match(input: string): TArguments | undefined;
}