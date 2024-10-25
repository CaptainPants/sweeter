import { z } from 'zod';

import { type Model } from '../Model.js';
import { type PropertyModel } from '../PropertyModel.js';

export class PropertyModelImpl<TZodType extends z.ZodTypeAny> implements PropertyModel<TZodType> {
    public constructor(name: string, valueModel: Model<TZodType>) {
        this.name = name;
        this.valueModel = valueModel;
    }

    public readonly name: string;
    public readonly valueModel: Model<TZodType>;
}
