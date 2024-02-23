import { type PropertyDefinition } from '../types/PropertyDefinition.js';

import { type UnknownModel, type Model } from './Model.js';

export interface UnknownPropertyModel {
    readonly name: string;
    readonly definition: PropertyDefinition<unknown>;
    readonly valueModel: UnknownModel;
}

export interface PropertyModel<TValue> {
    readonly name: string;
    readonly definition: PropertyDefinition<TValue>;
    readonly valueModel: Model<TValue>;
}
