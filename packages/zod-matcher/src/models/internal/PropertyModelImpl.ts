import { z } from 'zod';
import { type Model } from '../Model.js';
import { type PropertyModel } from '../PropertyModel.js';

export class PropertyModelImpl<TValue> implements PropertyModel<TValue> {
    public constructor(name: string, valueModel: Model<TValue>) {
        this.name = name;
        this.valueModel = valueModel;
    }

    public readonly name: string;
    public readonly valueModel: Model<TValue>;
}
