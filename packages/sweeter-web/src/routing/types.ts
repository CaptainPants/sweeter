import { type AnyComponent } from '@captainpants/sweeter-core';

export interface ArgumentMatcher {
    match(input: string, startIndex: number): number | undefined;
}

export type ArgumentMatcherTuple = readonly ArgumentMatcher[];

export type StringForEachItem<
    TArgumentMatcherTuple extends readonly ArgumentMatcher[],
> = { [Key in keyof TArgumentMatcherTuple]: string };

export interface PathTemplate<TResult extends readonly string[]> {
    match(input: string): TResult | undefined;

    /**
     * For future use in optimising the route table as a trie or similar.
     */
    getStaticPrefix(): string;
}

export type Route<TArguments extends readonly string[], TProps> = {
    path: PathTemplate<TArguments>;
    prepareProps(args: TArguments, path: string, url: URL): TProps;
    Component: AnyComponent<TProps>;
};
