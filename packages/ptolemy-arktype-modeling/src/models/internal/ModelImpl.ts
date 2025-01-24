import { type AnyTypeConstraint } from '../../type/types.js';
import { type BaseModel, type UnknownModel } from '../Model.js';
import { type ParentTypeInfo } from '../parents.js';

export class ModelImpl<TValue, TSchema extends AnyTypeConstraint>
    implements BaseModel<TValue, TSchema>
{
    public constructor(
        value: TValue,
        type: TSchema,
        parentInfo: ParentTypeInfo | null,
        archetype: string,
    ) {
        this.value = value;
        this.type = type;
        this.parentInfo = parentInfo;
        this.archetype = archetype;
    }

    public readonly value: TValue;
    public readonly type: TSchema;
    public readonly parentInfo: ParentTypeInfo | null;
    public readonly archetype: string;

    public asUnknown(): UnknownModel {
        return this;
    }
}
