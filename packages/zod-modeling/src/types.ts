import { z } from 'zod';
import { type Model } from './models/Model.js';

export type ValueTypeFromZodType<TDefinition extends z.ZodTypeAny> =
    z.infer<TDefinition>;

export type ValueTypeFromModel<TModel> = TModel extends Model<infer TZodType>
    ? ValueTypeFromZodType<TZodType>
    : never;

export type UnknownReplacer = (
    value: Model<z.ZodTypeAny>,
) => Promise<void>;
export type Replacer<T extends z.ZodTypeAny> = (
    value: Model<T>,
) => Promise<void>;
export type MultipleReplacer<T extends z.ZodTypeAny> = (
    value: Array<Model<T>>,
) => Promise<void>;

export type ReadonlyRecord<TKey extends string | number | symbol, TValue> = {
    readonly [Key in TKey]: TValue;
};

export type TypesEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <
    V,
>() => V extends U ? 1 : 2
    ? true
    : false;

export type IsAny<T> = 0 extends T & 1 ? true : false;
export type And<A extends boolean, B extends boolean> = A extends true ? (B extends true ? true : false) : false;