import { z } from 'zod';
import { UnknownModel, type Model } from './Model.js';

export function isModel<TZodType extends z.ZodTypeAny>(value: z.infer<TZodType> | Model<TZodType>): value is Model<TZodType>;
export function isModel(value: unknown): value is UnknownModel;
export function isModel(value: unknown): value is UnknownModel {
    return (
        typeof (value as UnknownModel).type === 'object' &&
        typeof (value as UnknownModel).archetype === 'string' &&
        // unknown value may be undefined, but should be present
        'value' in (value as UnknownModel) /* including prototype chain */ &&
        'parentInfo' in
            (value as UnknownModel) /* including prototype chain */
    );
}
