import { z } from 'zod';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TType extends z.ZodType,
> extends ModelImpl<T, TType> {
    public constructor(
        archetype: string,
        value: T,
        type: TType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, archetype);
    }
}
