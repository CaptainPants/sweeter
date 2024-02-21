import { descend, hasOwnProperty } from '@captainpants/sweeter-utilities';
import { type Type } from '../../types/Type.js';
import {
    type MapObjectEntry,
    type Model,
    type ReadonlyRecord,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type MapObjectType } from '../../index.js';

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
        const propertyModels: Record<string, Model<TValue>> = {};

        // Object.keys lets us avoid prototype pollution
        for (const name of Object.keys(value)) {
            const propertyValueModel = ModelFactory.createUnvalidatedModelPart({
                value: value[name]!,
                type: type.itemType,
                parentInfo: {
                    relationship: { type: 'property', property: name },
                    type,
                    parentInfo,
                },
                depth: descend(depth),
            });

            propertyModels[name] = propertyValueModel;
        }

        return new MapObjectImpl<TValue>(
            value,
            propertyModels,
            type,
            parentInfo,
        );
    }

    public constructor(
        value: Record<string, TValue>,
        propertyModels: ReadonlyRecord<string, Model<TValue>>,
        type: MapObjectType<TValue>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');

        this.#propertyModels = propertyModels;
    }

    #propertyModels: ReadonlyRecord<string, Model<TValue>>;

    public getItemType(): Type<TValue> {
        return this.type.itemType;
    }

    public async setProperty(
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

        const copy = {
            ...this.value,
            [key]: adopted.value as TValue,
        };

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const propertyModels = {
            ...this.#propertyModels,
            [key]: adopted,
        };
        const result = new MapObjectImpl<TValue>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public getProperty(key: string): Model<TValue> | undefined {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.#propertyModels, key)) {
            const result = this.#propertyModels[key];
            return result;
        }

        return undefined;
    }

    public async moveProperty(
        from: string, 
        to: string,
        validate: boolean = true,
    ): Promise<this> {
        const copy = {
            ...this.value,
            [to]: this.value[from]!
        };
        delete copy[from];

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const propertyModels = {
            ...this.#propertyModels,
            [to]: this.#propertyModels[from]!
        };
        delete propertyModels[from];

        const result = new MapObjectImpl<TValue>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async deleteProperty(
        key: string,
        validate: boolean = true,
    ): Promise<this> {
        const copy = {
            ...this.value,
        };
        delete copy[key];

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const propertyModels = {
            ...this.#propertyModels,
        };
        delete propertyModels[key];

        const result = new MapObjectImpl<TValue>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public getEntries(): readonly MapObjectEntry<TValue>[] {
        return Object.entries(this.#propertyModels).sort(([a], [b]) =>
            defaultSort(a, b),
        );
    }
}

function defaultSort<T>(a: T, b: T) {
    return a > b ? -1 : Object.is(a, b) ? 0 : 1;
}
