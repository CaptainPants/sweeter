export interface ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined;
}

export type ArgumentMatcherTuple = readonly ArgumentMatcher[];

export type StringForEachItem<
    TArgumentMatcherTuple extends readonly ArgumentMatcher[],
> = { [Key in keyof TArgumentMatcherTuple]: string };

export interface RouteTemplate<TResult extends readonly string[]> {
    match(input: string): TResult | undefined;

    /**
     * For future use in optimising the route table as a trie or similar.
     */
    getStaticPrefix(): string;
}

export type Route<TArguments extends readonly string[]> = {
    route: RouteTemplate<TArguments>;
    render(routeArgs: TArguments): JSX.Element;
};
