import { type PathMatcher, type Parameters, type MapTypeForPartMatcher } from "./types.js";

export function matches<TParameters extends Parameters>(input: string, pathTemplate: PathMatcher<TParameters>): MapTypeForPartMatcher<TParameters> | undefined {
    throw new TypeError();
}
