import { type, Type } from 'arktype';

import { AnyModelConstraint, type Model } from './models/Model.js';
import { AnyTypeConstraint } from './type/AnyTypeConstraint.js';

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

export type Constructor<TResult = unknown> = new (...args: any[]) => TResult;
