import { type BaseType } from '../../types/BaseType.js';
import { type Model, type ModelBase } from '../Model.js';
import { type ParentTypeInfo } from '../parents.js';

export class ModelImpl<
    TValue,
    TTypeType extends BaseType<TValue> = BaseType<TValue>,
> implements ModelBase<TValue, TTypeType>
{
    public constructor(
        value: TValue,
        type: TTypeType,
        parentInfo: ParentTypeInfo | null,
        archetype: string,
    ) {
        this.value = value;
        this.type = type;
        this.parentInfo = parentInfo;
        this.archetype = archetype;
    }

    public readonly value: TValue;
    public readonly type: TTypeType;
    public readonly parentInfo: ParentTypeInfo | null;
    public readonly archetype: string;

    public asUnknown(): Model<unknown> {
        return this as unknown as Model<unknown>;
    }
}
