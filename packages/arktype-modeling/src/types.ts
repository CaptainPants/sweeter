import { type AnyModelConstraint, type Model } from './models/Model.js';
import { type AnyTypeConstraint } from './type/types.js';

export type ValueTypeFromModel<TModel extends AnyModelConstraint> =
    TModel['value'];

export type UnknownReplacer = (
    value: Model<AnyTypeConstraint>,
) => Promise<void>;
export type Replacer<T extends AnyTypeConstraint> = (
    value: Model<T>,
) => Promise<void>;
export type MultipleReplacer<T extends AnyTypeConstraint> = (
    value: Array<Model<T>>,
) => Promise<void>;

export type ReadonlyRecord<TKey extends string | number | symbol, TValue> = {
    readonly [Key in TKey]: TValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<TResult = unknown> = new (...args: any[]) => TResult;
