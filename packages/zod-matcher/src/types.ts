import { z } from 'zod';
import { type Model } from './models/Model.js';

export type ValueTypeFromZodType<TDefinition extends z.ZodTypeAny> = z.infer<TDefinition>;

export type ValueTypeFromModel<TModel> = TModel extends Model<infer TZodType>
    ? ValueTypeFromZodType<TZodType>
    : never;

export type Replacer<T extends z.ZodTypeAny> = (value: Model<T>) => Promise<void>;
export type MultipleReplacer<T extends z.ZodTypeAny> = (value: Array<Model<T>>) => Promise<void>;

export type ReadonlyRecord<TKey extends string | number | symbol, TValue> = {
    readonly [Key in TKey]: TValue;
};
