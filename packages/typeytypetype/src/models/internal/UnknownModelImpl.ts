import { type UnknownType } from '../../types/UnknownType.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';

export class UnknownModelImpl extends ModelImpl<unknown, UnknownType> {
    public constructor(
        value: unknown,
        type: UnknownType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'unknown');
    }
}
