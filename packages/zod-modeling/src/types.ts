
import { type, Type } from 'arktype';

import { type Model } from './models/Model.js';
import { AnyTypeConstraint } from './type/AnyTypeConstraint.js';

export type ValueTypeFromArkType<TDefinition extends Type> = type.infer<TDefinition>;

export type ValueTypeFromModel<TModel> = TModel extends Model<infer TArkType>
    ? ValueTypeFromArkType<TArkType>
    : never;

export type UnknownReplacer = (value: Model<AnyTypeConstraint>) => Promise<void>;
export type Replacer<T extends AnyTypeConstraint> = (
    value: Model<T>,
) => Promise<void>;
export type MultipleReplacer<T extends AnyTypeConstraint> = (
    value: Array<Model<T>>,
) => Promise<void>;

export type ReadonlyRecord<TKey extends string | number | symbol, TValue> = {
    readonly [Key in TKey]: TValue;
};

export type Constructor<TResult = unknown> = new (...args: any[]) => TResult;