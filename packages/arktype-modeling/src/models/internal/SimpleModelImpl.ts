
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { AnyTypeConstraint } from '../../type/AnyTypeConstraint.js';

export class SimpleModelImpl<
    T,
    TArkType extends AnyTypeConstraint,
> extends ModelImpl<T, TArkType> {
    public constructor(
        archetype: string,
        value: T,
        type: TArkType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, archetype);
    }
}
