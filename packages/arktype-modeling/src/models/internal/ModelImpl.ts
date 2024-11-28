import { type UnspecifiedModel, type BaseModel } from '../Model.js';
import { type ParentTypeInfo } from '../parents.js';
import { type AnyTypeConstraint } from '../../type/types.js';

export class ModelImpl<TValue, TArkType extends AnyTypeConstraint>
    implements BaseModel<TValue, TArkType>
{
    public constructor(
        value: TValue,
        type: TArkType,
        parentInfo: ParentTypeInfo | null,
        archetype: string,
    ) {
        this.value = value;
        this.type = type;
        this.parentInfo = parentInfo;
        this.archetype = archetype;
    }

    public readonly value: TValue;
    public readonly type: TArkType;
    public readonly parentInfo: ParentTypeInfo | null;
    public readonly archetype: string;

    public asUnknown(): UnspecifiedModel {
        return this;
    }
}
