import { type Type } from 'arktype';

import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class UnknownTypedModelImpl extends ModelImpl<unknown, Type<unknown>> {
    public constructor(
        value: unknown,
        type: Type<unknown>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'unknown');
    }
}
