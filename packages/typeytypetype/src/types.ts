import { type Model } from './models/Model.js';
import { type Type } from './types/Type.js';

export type ValueTypeFromType<TDefinition> = TDefinition extends Type<infer T>
    ? T
    : never;
export type ValueTypeFromModel<TModel> = TModel extends Model<infer T>
    ? T
    : never;

export type Replacer<T> = (value: Model<T>) => Promise<void>;
export type MultipleReplacer<T> = (value: Array<Model<T>>) => Promise<void>;
