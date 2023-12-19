import type { PartMatcher, PathMatcher } from "./types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function route<const TArgs extends readonly PartMatcher<any>[]>(template: TemplateStringsArray, ...args: [...TArgs]): PathMatcher<TArgs> {
    throw new TypeError();
}
