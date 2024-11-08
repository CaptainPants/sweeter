
import { type UnknownModel, type Model } from './Model.js';
import { AnyTypeConstraint } from '../type/AnyTypeConstraint.js';

export interface UnknownPropertyModel {
    readonly name: string;
    readonly valueModel: UnknownModel;
    readonly isOptional: boolean; // TODO: undecided about whether this should be on the property, or remain in the type. Will depend on how its handled by editors I guess.
}

export interface PropertyModel<TArkType extends AnyTypeConstraint> {
    readonly name: string;
    readonly valueModel: Model<TArkType>;
    readonly isOptional: boolean; // TODO: undecided about whether this should be on the property, or remain in the type. Will depend on how its handled by editors I guess.
}
