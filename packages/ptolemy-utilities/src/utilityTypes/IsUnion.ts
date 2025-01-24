import { type UnionToIntersection } from './UnionToIntersection.js';

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// https://ghaiklor.github.io/type-challenges-solutions/en/medium-isunion.html

// // Voodoo magic in that T is distributed by the condition, so [T] will be a single element of a union vs [C] will be the whole union
// export type IsUnion<T, C = T> =
//     // Weirdly boolean seems to behave as a union true | false -- this might be to do with support for discriminated unions
//     // These guys also noticed it https://www.reddit.com/r/typescript/comments/11k1ch4/a_boolean_type_becomes_true_false_when_being/
//     T extends C ? ([C] extends [T] ? false : true) : never;
