import { type z } from 'zod';

import { descend, hasOwnProperty } from '@captainpants/sweeter-utilities';

import {
    type ObjectModel,
    type Model,
    type UnknownModel,
    type PropertyModels,
    type TypedPropertyModelForKey,
    UnknownObjectModel,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { type ReadonlyRecord } from '../../types.js';
import { type zodUtilityTypes } from '../../utility/zodUtilityTypes.js';
import { validateAndThrow } from '../validate.js';
import {
    type PropertyModel,
    type UnknownPropertyModel,
} from '../PropertyModel.js';

export class ObjectImpl<TZodObjectType extends z.AnyZodObject>
    extends ModelImpl<z.infer<TZodObjectType>, TZodObjectType>
    implements ObjectModel<TZodObjectType>
{
    public static createFromValue<TZodObjectType extends z.AnyZodObject>(
        value: z.infer<TZodObjectType>,
        schema: TZodObjectType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ObjectImpl<TZodObjectType> {
        const propertyModels: Record<string, UnknownPropertyModel> = {};

        const shape = schema.shape as ReadonlyRecord<
            string | symbol,
            z.ZodTypeAny
        >;

        // Object.keys lets us avoid prototype pollution
        for (const [propertyName, propertyValue] of Object.entries(value)) {
            const shapeType =
                shape[propertyName] ?? (schema._def.catchall as z.ZodTypeAny);

            // TODO: this should potentially unwrap out ZodOptional
            const propertyValueModel = ModelFactory.createUnvalidatedModelPart({
                value: propertyValue,
                type: shapeType,
                parentInfo: {
                    relationship: { type: 'property', property: propertyName },
                    type: schema,
                    parentInfo,
                },
                depth: descend(depth),
            });

            propertyModels[propertyName] = {
                name: propertyName,
                valueModel: propertyValueModel,
                isOptional: shapeType.isOptional(),
            };
        }

        return new ObjectImpl<TZodObjectType>(
            value,
            propertyModels as PropertyModels<TZodObjectType>,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: z.infer<TZodObjectType>,
        properties: PropertyModels<TZodObjectType>,
        type: TZodObjectType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');

        this.#properties = properties;
    }

    #properties: PropertyModels<TZodObjectType>;

    public unknownGetCatchallType(): z.ZodTypeAny {
        return this.type._def.catchall;
    }

    public getCatchallType(): zodUtilityTypes.CatchallPropertyValueType<TZodObjectType> {
        return this.type._def.catchall;
    }

    private typeForKey(key: string) {
        const shapeType: z.ZodTypeAny | undefined = this.type.shape[key];
        const catchall: z.ZodTypeAny | undefined = this.type._def.catchall;

        const type: z.ZodTypeAny | undefined = shapeType ?? catchall;

        if (!type) {
            throw new Error(
                `Property ${key} not found and no catchall type provided.`,
            );
        }

        return type;
    }

    public async unknownSetProperty(
        key: string,
        value: unknown,
        validate: boolean = true,
    ): Promise<this> {
        const type = this.typeForKey(key);

        const adopted = ModelFactory.createUnvalidatedModelPart({
            value,
            type,
            parentInfo: {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { property: key, type: 'property' },
            },
        });

        const copy = {
            ...this.value,
        };
        (copy as Record<string, unknown>)[key] = adopted.value;

        if (validate) {
            await validateAndThrow(this.type, copy, { deep: true });
        }

        const propertyModels = {
            ...this.#properties,
            [key]: adopted,
        };
        const result = new ObjectImpl<TZodObjectType>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async setProperty<
        TKey extends keyof z.infer<TZodObjectType> & string,
        TValue extends z.infer<TZodObjectType>[TKey],
    >(
        key: TKey,
        value: TValue | Model<TValue>,
        validate: boolean = true,
    ): Promise<this> {
        return this.unknownSetProperty(key, value, validate);
    }

    public unknownGetProperty(key: string): UnknownPropertyModel | undefined {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.#properties, key)) {
            const result = this.#properties[key];
            return result;
        }

        return undefined;
    }

    public getProperty<
        TKey extends keyof zodUtilityTypes.Shape<TZodObjectType> & string,
    >(key: TKey): TypedPropertyModelForKey<TZodObjectType, TKey> {
        return this.unknownGetProperty(key) as TypedPropertyModelForKey<
            TZodObjectType,
            TKey
        >;
    }

    public async moveProperty(
        from: string,
        to: string,
        validate: boolean = true,
    ): Promise<this> {
        if (hasOwnProperty(this.type.shape, from)) {
            throw new Error(`Cannot delete a known property '${from}'.`);
        }
        if (hasOwnProperty(this.type.shape, to)) {
            throw new Error(`Cannot add a known property '${to}'.`);
        }

        const copy = {
            ...this.value,
            [to]: this.value[from]!,
        };
        delete copy[from];

        if (validate) {
            await validateAndThrow(this.type, copy, { deep: true });
        }

        const propertyModels = {
            ...this.#properties,
            [to]: this.#properties[from]!,
        };
        delete propertyModels[from];

        const result = new ObjectImpl<TZodObjectType>(
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
        if (hasOwnProperty(this.type.shape, key)) {
            throw new Error(`Cannot delete a known property '${key}'.`);
        }

        const copy = {
            ...this.value,
        };
        delete copy[key];

        if (validate) {
            await validateAndThrow(this.type, copy, { deep: false });
        }

        const propertyModels = {
            ...this.#properties,
        };
        delete propertyModels[key];

        const result = new ObjectImpl<TZodObjectType>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public unknownGetProperties(): readonly UnknownPropertyModel[] {
        return Object.values(this.#properties).sort((a, b) =>
            defaultSort(a.name, b.name),
        );
    }

    public getProperties(): readonly PropertyModel<
        z.infer<TZodObjectType>[keyof z.infer<TZodObjectType>]
    >[] {
        return Object.values(this.#properties).sort((a, b) =>
            defaultSort(a.name, b.name),
        );
    }
}

function defaultSort<T>(a: T, b: T) {
    return a > b ? -1 : Object.is(a, b) ? 0 : 1;
}
