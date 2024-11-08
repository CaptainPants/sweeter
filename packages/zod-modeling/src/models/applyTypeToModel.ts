import { type z } from 'zod';

import { type Model } from './Model.js';
import { ModelFactory } from './ModelFactory.js';
import { AnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { parseAsync } from '../utility/parse.js';

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
            arkType: toType,
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
    TFromArkType extends AnyTypeConstraint,
    TToArkType extends AnyTypeConstraint,
>(model: Model<TFromArkType>, toType: TToArkType): Promise<Model<TToArkType>> {
    const converted = await parseAsync(model.value, toType);

    return ModelFactory.createUnvalidatedModelPart<TToArkType>({
        value: converted,
        arkType: toType,
        parentInfo: model.parentInfo,
    });
}
