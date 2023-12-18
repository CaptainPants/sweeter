import { type PropertyDefinition } from '../../types/PropertyDefinition.js';
import { type Model } from '../Model.js';
import { type PropertyModel } from '../PropertyModel.js';

export class PropertyModelImpl<TValue> implements PropertyModel<TValue> {
    public constructor(
        name: string,
        definition: PropertyDefinition<TValue>,
        valueModel: Model<TValue>,
    ) {
        this.name = name;
        this.definition = definition;
        this.valueModel = valueModel;
    }

    public readonly name: string;
    public readonly definition: PropertyDefinition<TValue>;
    public readonly valueModel: Model<TValue>;
}
