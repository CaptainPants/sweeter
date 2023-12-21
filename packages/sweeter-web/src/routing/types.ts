export interface ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined;
}

export type ArgumentMatcherTuple = readonly ArgumentMatcher[];

export type StringForEachItem<
    TArgumentMatcherTuple extends readonly ArgumentMatcher[],
> = { [Key in keyof TArgumentMatcherTuple]: string };

export interface RouteTemplate<TResult extends readonly string[]> {
    match(input: string): TResult | undefined;
}
