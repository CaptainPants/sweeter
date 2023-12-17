import { type PropertyDefinition } from '../types/PropertyDefinition.js';

import { type Model } from './Model.js';

export interface PropertyModel<TValue> {
    readonly name: string;
    readonly definition: PropertyDefinition<TValue>;
    readonly valueModel: Model<TValue>;
}
