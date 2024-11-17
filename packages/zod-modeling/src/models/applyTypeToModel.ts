
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
    TFromZodType extends AnyTypeConstraint,
    TToZodType extends AnyTypeConstraint,
>(
    model: Model<TFromZodType>,
    toType: TToZodType,
): Promise<Model<TToZodType> | undefined> {
    const validationResult = await safeParseAsync(model.value, toType);
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
    TSourceModel extends AnyModelConstraint,
    TToArkType extends AnyTypeConstraint,
>(model: TSourceModel, toType: TToArkType): Promise<Model<TToArkType>> {
    const converted = await parseAsync(model.value, toType);

    return ModelFactory.createUnvalidatedModelPart<TToArkType>({
        value: converted,
        arkType: toType,
        parentInfo: model.parentInfo,
    });
}
