import { type UnspecifiedModel, type Model } from './Model.js';
import { type AnyTypeConstraint } from '../type/types.js';

export interface UnknownPropertyModel {
    readonly name: string | symbol;
    readonly valueModel: UnspecifiedModel;
    readonly isOptional: boolean; // TODO: undecided about whether this should be on the property, or remain in the type. Will depend on how its handled by editors I guess.
}

export interface PropertyModel<TSchema extends AnyTypeConstraint> {
    readonly name: string | symbol;
    readonly valueModel: Model<TSchema>;
    readonly isOptional: boolean; // TODO: undecided about whether this should be on the property, or remain in the type. Will depend on how its handled by editors I guess.
}
