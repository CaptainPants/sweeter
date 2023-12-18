import { type Model } from './Model.js';

export function isModel<T>(value: T | Model<T>): value is Model<T>;
export function isModel(value: unknown): value is Model<unknown>;
export function isModel(value: unknown): value is Model<unknown> {
    return (
        typeof (value as Model<unknown>).type === 'object' &&
        typeof (value as Model<unknown>).archetype === 'string' &&
        // unknown value may be undefined, but should be present
        'value' in (value as Model<unknown>) /* including prototype chain */ &&
        'parentInfo' in
            (value as Model<unknown>) /* including prototype chain */
    );
}
