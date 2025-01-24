import { type } from 'arktype';

import { descend } from '@serpentis/ptolemy-utilities';

import { type AnyTypeConstraint } from '../../type/types.js';
import { validateAndThrow } from '../../utility/validate.js';
import { isModel } from '../isModel.js';
import { type Model } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { isEquivalentParentInfo } from './isEquivalentParentInfo.js';

/**
 * For a given value (raw or model) validate that the value matches the type (using validateOrThrow). Throw if it does not.
 * Return a model. Primarily for use in Model member functions that take an unknown.
 * @param valueOrModel
 * @param type
 * @param parentInfo
 * @param depth
 * @returns
 */
export async function validateAndMakeModel<TSchema extends AnyTypeConstraint>(
    valueOrModel: unknown,
    type: TSchema,
    parentInfo: ParentTypeInfo | null,
    depth = descend.defaultDepth,
): Promise<Model<TSchema>> {
    let validated: type.infer<TSchema>;
    if (isModel(valueOrModel)) {
        // type is the same object, and parentInfo is the same
        if (
            valueOrModel.type == type &&
            isEquivalentParentInfo(valueOrModel.parentInfo, parentInfo)
        ) {
            return valueOrModel as Model<TSchema>; // Keep model and e.g. its parentInfo with their original identity
        } else {
            validated = await validateAndThrow(type, valueOrModel.value);
        }
    } else {
        validated = await validateAndThrow(type, valueOrModel);
    }

    return ModelFactory.createModelPart<TSchema>({
        parentInfo,
        schema: type,
        value: validated,
        depth,
    });
}
