import { descend } from '@captainpants/sweeter-utilities';
import { type Type } from '../../metadata/Type.js';
import { isModel } from '../isModel.js';
import { type Model } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

/**
 * For a given value (raw or model) validate that the value matches the type (using validateOrThrow). Throw if it does not.
 * Return a model. Primarily for use in Model member functions that take an unknown.
 * @param valueOrModel
 * @param type
 * @param parentInfo
 * @param factory
 * @param depth
 * @returns
 */
export async function validateAndMakeModel<T>(
    valueOrModel: unknown,
    type: Type<T>,
    parentInfo: ParentTypeInfo | null,
    validate: boolean,
    depth = descend.defaultDepth,
): Promise<Model<T>> {
    if (isModel(valueOrModel)) {
        if (valueOrModel.type === type) {
            return valueOrModel as Model<T>;
        } else {
            let validated: T;
            if (validate) {
                validated = await type.validateAndThrow(valueOrModel.value);
            } else {
                // If not 'validating' we at least check the structure..
                if (type.matches(valueOrModel.value)) {
                    validated = valueOrModel.value;
                } else {
                    throw new TypeError('Non-matching structure');
                }
            }

            return ModelFactory.createUnvalidatedModelPart({
                parentInfo,
                type,
                value: validated,
                depth,
            });
        }
    } else {
        const validated = await type.validateAndThrow(valueOrModel);
        return ModelFactory.createUnvalidatedModelPart({
            parentInfo,
            type,
            value: validated,
            depth,
        });
    }
}
