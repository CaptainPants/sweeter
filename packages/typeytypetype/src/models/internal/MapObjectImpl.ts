import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type Type, type MapObjectType } from '../../index.js';

export class MapObjectImpl<TValue> extends ModelImpl<
    Record<string, TValue>,
    MapObjectType<TValue>
> {
    public static createFromValue<TValue>(
        value: Record<string, TValue>,
        type: MapObjectType<TValue>,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): MapObjectImpl<TValue> {
        return new MapObjectImpl<TValue>(value, type, parentInfo);
    }

    public constructor(
        value: Record<string, TValue>,
        type: MapObjectType<TValue>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');
    }

    public getExpandoPropertyType(): Type<TValue> {
        return this.type.itemType;
    }

    public async setPropertyValue(
        key: string,
        value: unknown,
        validate: boolean = true,
    ): Promise<this> {
        const adopted = await validateAndMakeModel(
            value,
            this.type.itemType,
            {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { property: key, type: 'property' },
            },
            validate,
        );

        const copy: Record<string, TValue> = {
            ...this.value,
        };
        copy[key] = adopted.value as TValue;

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const result = new MapObjectImpl<TValue>(
            copy,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async deleteProperty(
        key: string,
        validate: boolean = true,
    ): Promise<this> {
        const copy = { ...this.value };

        delete copy[key];

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const result = new MapObjectImpl<TValue>(
            copy,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }
}
