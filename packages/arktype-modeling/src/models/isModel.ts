import {
    type UnspecifiedModel,
    type Model,
    AnyModelConstraint,
} from './Model.js';

type OnlyModels<T> = T extends UnspecifiedModel ? T : never;

export function isModel(value: unknown): value is UnspecifiedModel;
export function isModel<TModel>(value: TModel): value is OnlyModels<TModel>;
export function isModel(value: unknown): value is UnspecifiedModel {
    return (
        typeof (value as UnspecifiedModel).type === 'object' &&
        typeof (value as UnspecifiedModel).archetype === 'string' &&
        // unknown value may be undefined, but should be present
        'value' in
            (value as UnspecifiedModel) /* including prototype chain */ &&
        'parentInfo' in
            (value as UnspecifiedModel) /* including prototype chain */
    );
}
