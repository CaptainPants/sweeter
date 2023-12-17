import { type Type } from '../types/index.js';
import { type ValidationOptions } from '../validation/index.js';

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
    toType: Type<TTo>,
    options?: ValidationOptions,
): Promise<Model<TTo> | undefined> {
    const validationResult = await toType.validate(model.value, options);
    if (validationResult.success) {
        return ModelFactory.createUnvalidatedModelPart<TTo>({
            value: validationResult.result,
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
    toType: Type<TTo>,
    options?: ValidationOptions,
): Promise<Model<TTo>> {
    const converted = await toType.validateAndThrow(model.value, options);
    return ModelFactory.createUnvalidatedModelPart<TTo>({
        value: converted,
        type: toType,
        parentInfo: model.parentInfo,
    });
}
