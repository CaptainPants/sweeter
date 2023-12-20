export interface ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined;
}

export type ArgumentMatcherTuple = readonly ArgumentMatcher[];

export type ResultTupleFromSegmentMatcherTuple<
    TArgumentMatcherTuple extends readonly ArgumentMatcher[],
> = { [Key in keyof TArgumentMatcherTuple]: string };

export interface PathTemplate<TArguments extends ArgumentMatcherTuple> {
    match(
        input: string,
    ): ResultTupleFromSegmentMatcherTuple<TArguments> | undefined;
}
