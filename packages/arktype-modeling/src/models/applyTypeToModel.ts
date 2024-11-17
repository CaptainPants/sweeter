
import { AnyModelConstraint, type Model } from './Model.js';
import { ModelFactory } from './ModelFactory.js';
import { AnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { parseAsync, safeParseAsync } from '../utility/parse.js';

/**
 * Attempt to validate the given models' value against the new type, returning undefined on failure.
 * @param model
 * @param toType
 * @param options
 * @returns
 */
export async function tryApplyTypeToModel<
    TSourceModel extends AnyModelConstraint,
    TToArkType extends AnyTypeConstraint,
>(
    model: TSourceModel,
    toType: TToArkType,
): Promise<Model<TToArkType> | undefined> {
    const validationResult = await safeParseAsync(model.value, toType);
    if (validationResult.success) {
        return ModelFactory.createUnvalidatedModelPart<TToArkType>({
            value: validationResult.data,
            schema: toType,
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
    TSourceModel extends AnyModelConstraint,
    TToArkType extends AnyTypeConstraint,
>(model: TSourceModel, toType: TToArkType): Promise<Model<TToArkType>> {
    const converted = await parseAsync(model.value, toType);

    return ModelFactory.createUnvalidatedModelPart<TToArkType>({
        value: converted,
        schema: toType,
        parentInfo: model.parentInfo,
    });
}
