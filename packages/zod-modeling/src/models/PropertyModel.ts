import { type z } from 'zod';
import { type UnknownModel, type Model } from './Model.js';

export interface UnknownPropertyModel {
    readonly name: string;
    readonly valueModel: UnknownModel;
    readonly isOptional: boolean; // TODO: undecided about whether this should be on the property, or remain in the type. Will depend on how its handled by editors I guess.
}

export interface PropertyModel<TZodType extends z.ZodTypeAny> {
    readonly name: string;
    readonly valueModel: Model<TZodType>;
    readonly isOptional: boolean; // TODO: undecided about whether this should be on the property, or remain in the type. Will depend on how its handled by editors I guess.
}
