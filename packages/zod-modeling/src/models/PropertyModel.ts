import { type z } from 'zod';
import { type UnknownModel, type Model } from './Model.js';

export interface UnknownPropertyModel {
    readonly name: string;
    readonly valueModel: UnknownModel;
}

export interface PropertyModel<TZodType extends z.ZodTypeAny> {
    readonly name: string;
    readonly valueModel: Model<TZodType>;
}
