import { type UnknownModel, type Model } from './Model.js';

export interface UnknownPropertyModel {
    readonly name: string;
    readonly valueModel: UnknownModel;
}

export interface PropertyModel<TValue> {
    readonly name: string;
    readonly valueModel: Model<TValue>;
}
