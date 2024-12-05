import { isType } from '../type/introspect/is.js';
import { type UnknownModel } from './Model.js';

type OnlyModels<T> = T extends UnknownModel ? T : never;

export function isModel(value: unknown): value is UnknownModel;
export function isModel<TModel>(value: TModel): value is OnlyModels<TModel>;
export function isModel(value: unknown): value is UnknownModel {
    return (
        isType((value as UnknownModel).type) &&
        typeof (value as UnknownModel).archetype === 'string' &&
        // unknown value may be undefined, but should be present
        'value' in
            (value as UnknownModel) /* including prototype chain */ &&
        'parentInfo' in
            (value as UnknownModel) /* including prototype chain */
    );
}
