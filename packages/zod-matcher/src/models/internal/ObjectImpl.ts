import { descend, hasOwnProperty } from '@captainpants/sweeter-utilities';
import { type Type } from '../../types/Type.js';
import {
    ObjectModel,
    type MapObjectEntry,
    type Model,
    type UnknownMapObjectEntry,
    UnknownModel,
    FixedPropertyModels,
    CatchallPropertyModels,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type ReadonlyRecord } from '../../types.js';
import { ZodObjectDef, z } from 'zod';

export class ObjectImpl<TZodType extends z.AnyZodObject>
    extends ModelImpl<z.infer<TZodType>, TZodType>
    implements ObjectModel<TZodType>
{
    public static createFromValue<TZodType extends z.AnyZodObject>(
        value: z.infer<TZodType>,
        schema: TZodType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ObjectImpl<TZodType> {
        const propertyModels: Record<string, UnknownModel> = {};

        const shape = schema.shape as ReadonlyRecord<string | symbol, z.ZodTypeAny>;

        // Object.keys lets us avoid prototype pollution
        for (const [name, keyType] of Object.entries(shape)) {
            const propertyValueModel = ModelFactory.createUnvalidatedModelPart({
                value: value[name],
                type: keyType,
                parentInfo: {
                    relationship: { type: 'property', property: name },
                    type: schema,
                    parentInfo,
                },
                depth: descend(depth),
            });

            (propertyModels as Record<string, UnknownModel>)[name] = propertyValueModel;
        }
        
        if (schema._def.catchall) {
            
        }

        return new ObjectImpl<TZodType>(
            value,
            propertyModels as FixedPropertyModels<TZodType>,
            catchallProperties as CatchallPropertyModels<TZodType>,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: z.infer<TZodType>,
        properties: FixedPropertyModels<TZodType>,
        catchallProperties: CatchallPropertyModels<TZodType>,
        type: TZodType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');

        this.#properties = properties;
        this.#catchallProperties = catchallProperties;
    }

    #properties: FixedPropertyModels<TZodType>;
    #catchallProperties: ReadonlyRecord<string, UnknownModel>;

    public unknownGetItemType(): Type<unknown> {
        return this.type.itemType;
    }

    public getItemType(): Type<TValue> {
        return this.type.itemType;
    }

    public async unknownSetProperty(
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
            ...this.#properties,
            [key]: adopted,
        };
        const result = new ObjectImpl<TValue>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async setProperty(
        key: string,
        value: TValue | Model<TValue>,
        validate: boolean = true,
    ): Promise<this> {
        return this.unknownSetProperty(key, value, validate);
    }

    public unknownGetProperty(key: string): Model<TValue> | undefined {
        return this.getProperty(key);
    }

    public getProperty(key: string): Model<TValue> | undefined {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.#properties, key)) {
            const result = this.#properties[key];
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
            [to]: this.value[from]!,
        };
        delete copy[from];

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const propertyModels = {
            ...this.#properties,
            [to]: this.#properties[from]!,
        };
        delete propertyModels[from];

        const result = new ObjectImpl<TValue>(
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
            ...this.#properties,
        };
        delete propertyModels[key];

        const result = new ObjectImpl<TValue>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public unknownGetEntries(): readonly UnknownMapObjectEntry[] {
        return Object.entries(this.#properties).sort(([a], [b]) =>
            defaultSort(a, b),
        );
    }

    public getEntries(): readonly MapObjectEntry<TValue>[] {
        return Object.entries(this.#properties).sort(([a], [b]) =>
            defaultSort(a, b),
        );
    }
}

function defaultSort<T>(a: T, b: T) {
    return a > b ? -1 : Object.is(a, b) ? 0 : 1;
}
