import { z } from 'zod';
import { type UnknownModel, type Model, type ModelBase } from '../Model.js';
import { type ParentTypeInfo } from '../parents.js';

export class ModelImpl<TValue, TZodType extends z.ZodTypeAny>
    implements ModelBase<TValue, TZodType>
{
    public constructor(
        value: TValue,
        type: TZodType,
        parentInfo: ParentTypeInfo | null,
        archetype: string,
    ) {
        this.value = value;
        this.type = type;
        this.parentInfo = parentInfo;
        this.archetype = archetype;
    }

    public readonly value: TValue;
    public readonly type: TZodType;
    public readonly parentInfo: ParentTypeInfo | null;
    public readonly archetype: string;

    public asUnknown(): UnknownModel {
        return this as any;
    }
}
