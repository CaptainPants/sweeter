import { type AnyTypeConstraint } from '../../type/types.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TSchema extends AnyTypeConstraint,
> extends ModelImpl<T, TSchema> {
    public constructor(
        archetype: string,
        value: T,
        type: TSchema,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, archetype);
    }
}
