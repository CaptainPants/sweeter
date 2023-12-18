import { type PropertyDefinition } from '../PropertyDefinition.js';
import { type Type } from '../Type.js';

export type PropertyDefinitions<TObject extends Record<string, unknown>> = {
    readonly [TKey in keyof TObject]: PropertyDefinition<TObject[TKey]>;
};

export type MappedType<T> = {
    [TKey in keyof T]: Type<T[TKey]>;
};

export type SpreadUnionType<TUnion> = TUnion extends unknown
    ? Type<TUnion>
    : never;
