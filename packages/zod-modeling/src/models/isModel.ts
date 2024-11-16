import { type UnknownModel, type Model } from './Model.js';
import { AnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { type } from 'arktype';

export function isModel<TArkType extends AnyTypeConstraint>(
    value: type.infer<TArkType> | Model<TArkType>,
): value is Model<TArkType>;
export function isModel(value: unknown): value is UnknownModel;
export function isModel(value: unknown): value is UnknownModel {
    return (
        typeof (value as UnknownModel).type === 'object' &&
        typeof (value as UnknownModel).archetype === 'string' &&
        // unknown value may be undefined, but should be present
        'value' in (value as UnknownModel) /* including prototype chain */ &&
        'parentInfo' in (value as UnknownModel) /* including prototype chain */
    );
}
