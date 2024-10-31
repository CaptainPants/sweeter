import { z } from 'zod';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class SimpleModelImpl<
    T,
    TZodType extends z.ZodTypeAny,
> extends ModelImpl<T, TZodType> {
    public constructor(
        archetype: string,
        value: T,
        type: TZodType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, archetype);
    }
}
