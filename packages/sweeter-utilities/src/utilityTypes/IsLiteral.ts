import { type Or } from "./Or.js";

type _IsLiteralOf<T, TLiteralBase> = [T] extends [TLiteralBase] ? [TLiteralBase] extends [T] ? false : true : false;

export type IsStringLiteral<T> = _IsLiteralOf<T, string>;
export type IsNumberLiteral<T> = _IsLiteralOf<T, number>;
export type IsBooleanLiteral<T> = _IsLiteralOf<T, boolean>;

export type IsLiteral<T> = Or<[
    IsStringLiteral<T>,
    IsNumberLiteral<T>,
    IsBooleanLiteral<T>
]>;
