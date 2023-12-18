import { type BaseType } from '../../types/BaseType.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TTypeType extends BaseType<T>,
> extends ModelImpl<T, TTypeType> {
    public constructor(
        archetype: string,
        value: T,
        type: TTypeType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, archetype);
    }
}
