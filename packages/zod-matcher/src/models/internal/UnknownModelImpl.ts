import { z } from 'zod';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class UnknownModelImpl extends ModelImpl<unknown, z.ZodUnknown> {
    public constructor(
        value: unknown,
        type: z.ZodUnknown,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'unknown');
    }
}
