
import { descend } from '@captainpants/sweeter-utilities';

import { isModel } from '../isModel.js';
import { type Model } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';
import { shallowMatchesStructure, validateAndThrow } from '../../utility/validate.js';
import { AnyTypeConstraint } from '../../type/AnyTypeConstraint.js';
import { type } from 'arktype';

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
export async function validateAndMakeModel<TArkType extends AnyTypeConstraint>(
    valueOrModel: unknown,
    type: TArkType,
    parentInfo: ParentTypeInfo | null,
    validate: boolean,
    depth = descend.defaultDepth,
): Promise<Model<TArkType>> {
    if (isModel(valueOrModel)) {
        if (valueOrModel.type === type) {
            return valueOrModel as unknown as Model<TArkType>;
        } else {
            let validated: type.infer<TArkType>;
            if (validate) {
                validated = await validateAndThrow(type, valueOrModel.value);
            } else {
                // If not 'validating' we at least check the structure..
                if (shallowMatchesStructure(type, valueOrModel.value)) {
                    validated = valueOrModel.value;
                } else {
                    throw new TypeError('Non-matching structure');
                }
            }

            return ModelFactory.createUnvalidatedModelPart<TArkType>({
                parentInfo,
                arkType: type,
                value: validated,
                depth,
            });
        }
    } else {
        const validated = await validateAndThrow<TArkType>(type, valueOrModel);

        return ModelFactory.createUnvalidatedModelPart<TArkType>({
            parentInfo,
            arkType: type,
            value: validated,
            depth,
        });
    }
}
