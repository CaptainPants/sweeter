import { type z } from 'zod';

import { type Model } from './Model.js';
import { ModelFactory } from './ModelFactory.js';

/**
 * Attempt to validate the given models' value against the new type, returning undefined on failure.
 * @param model
 * @param toType
 * @param options
 * @returns
 */
export async function tryApplyTypeToModel<
    TFromZodType extends z.ZodTypeAny,
    TToZodType extends z.ZodTypeAny,
>(
    model: Model<TFromZodType>,
    toType: TToZodType,
): Promise<Model<TToZodType> | undefined> {
    const validationResult = await toType.safeParseAsync(model.value);
    if (validationResult.success) {
        return ModelFactory.createUnvalidatedModelPart<TToZodType>({
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
export async function applyTypeToModel<
    TFromZodType extends z.ZodTypeAny,
    TToZodType extends z.ZodTypeAny,
>(model: Model<TFromZodType>, toType: TToZodType): Promise<Model<TToZodType>> {
    const converted = await toType.parseAsync(model.value);

    return ModelFactory.createUnvalidatedModelPart<TToZodType>({
        value: converted,
        type: toType,
        parentInfo: model.parentInfo,
    });
}
