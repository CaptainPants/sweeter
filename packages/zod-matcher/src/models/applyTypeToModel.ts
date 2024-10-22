import { z } from 'zod';

import { type Model } from './Model.js';
import { ModelFactory } from './ModelFactory.js';

/**
 * Attempt to validate the given models' value against the new type, returning undefined on failure.
 * @param model
 * @param toType
 * @param options
 * @returns
 */
export async function tryApplyTypeToModel<TFrom, TTo>(
    model: Model<TFrom>,
    toType: z.ZodType<TTo>
): Promise<Model<TTo> | undefined> {
    const validationResult = await toType.safeParseAsync(model.value);
    if (validationResult.success) {
        return ModelFactory.createUnvalidatedModelPart<TTo>({
            value: validationResult.data,
            type: toType,
            parentInfo: model.parentInfo,
        });
    }
    return undefined;
}

/**
 * Attempt to validate the given models' value against the new type, throwing an exception on failure.
 * @param model
 * @param toType
 * @param options
 * @returns
 */
export async function applyTypeToModel<TFrom, TTo>(
    model: Model<TFrom>,
    toType: z.ZodType<TTo>,
): Promise<Model<TTo>> {
    const converted = await toType.parseAsync(model.value);
    return ModelFactory.createUnvalidatedModelPart<TTo>({
        value: converted,
        type: toType,
        parentInfo: model.parentInfo,
    });
}
