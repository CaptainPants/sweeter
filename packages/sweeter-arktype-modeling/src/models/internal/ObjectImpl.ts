import { type } from 'arktype';

import { descend, hasOwnProperty } from '@captainpants/sweeter-utilities';

import { introspect } from '../../type/index.js';
import { getObjectTypeInfo } from '../../type/introspect/getObjectTypeInfo.js';
import {
    type AnyObjectTypeConstraint,
    type UnknownType,
} from '../../type/types.js';
import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { validateAndThrow } from '../../utility/validate.js';
import {
    type ObjectModel,
    type ObjectPropertyType,
    type PropertyModelNoConstraint,
    type TypedPropertyModelForKey,
    type UnknownModel,
    type ValueModelForProperty,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';
import { type UnknownPropertyModel } from '../PropertyModel.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';

type UnknownRecord = Record<string | symbol, unknown>;
type KnownPropertyModels = {
    [key: string | symbol]: UnknownPropertyModel;
};

function* entries(obj: object): Iterable<readonly [string | symbol, unknown]> {
    for (const tuple of Object.entries(obj)) {
        yield tuple as never;
    }
    for (const symbol of Object.getOwnPropertySymbols(obj)) {
        yield [symbol, (obj as Record<symbol, unknown>)[symbol]] as never;
    }
}

export class ObjectImpl<TObjectSchema extends AnyObjectTypeConstraint>
    extends ModelImpl<type.infer<TObjectSchema>, TObjectSchema>
    implements ObjectModel<TObjectSchema>
{
    public static createFromValue<
        TObjectArkType extends AnyObjectTypeConstraint,
    >(
        value: type.infer<TObjectArkType>,
        schema: TObjectArkType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ObjectImpl<TObjectArkType> {
        const propertyModels: KnownPropertyModels = {};

        const typeInfo = introspect.getObjectTypeInfo(schema);

        const source = { ...(value as UnknownRecord) };

        for (const [
            propertyName,
            propertyType,
        ] of typeInfo.getFixedProperties()) {
            const propertyValue = source[propertyName];
            delete source[propertyName];

            const propertyValueModel = ModelFactory.createModelPart({
                value: propertyValue,
                schema: propertyType,
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
                isOptional: propertyType.meta.optional ?? false,
            };
        }

        const mapped = [...typeInfo.getMappedKeys().entries()];
        for (const [propertyName, propertyValue] of entries(source)) {
            const match = mapped.find(([keySchema]) =>
                keySchema.allows(propertyName),
            );

            // If we don't have type information, so unknown is the best we can do
            const propertyValueSchema = match ? match[1] : type.unknown;

            const propertyValueModel = ModelFactory.createModelPart({
                value: propertyValue,
                schema: propertyValueSchema,
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
                isOptional: propertyValueSchema.meta.optional ?? false,
            };
        }

        return new ObjectImpl<TObjectArkType>(
            value,
            propertyModels,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: type.infer<TObjectSchema>,
        properties: KnownPropertyModels,
        type: TObjectSchema,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');

        this.#properties = properties;
    }

    #properties: KnownPropertyModels;

    public unknownGetCatchallType():
        | ReadonlyMap<UnknownType, UnknownType>
        | undefined {
        return getObjectTypeInfo(this.type).getMappedKeys();
    }

    public getCatchallType(): arkTypeUtilityTypes.CatchallPropertyMap<TObjectSchema> {
        return getObjectTypeInfo(
            this.type,
        ).getMappedKeys() as arkTypeUtilityTypes.CatchallPropertyMap<TObjectSchema>;
    }

    private schemaForKey(key: string | symbol) {
        const info = getObjectTypeInfo(this.type);
        const fixedProps = info.getFixedProperties();

        let type: UnknownType | undefined = fixedProps.get(key);
        if (!type) {
            const mappedKeys = info.getMappedKeys();
            if (mappedKeys) {
                const matchingKey = [...mappedKeys.entries()].filter(
                    ([indexerKey, ]) => indexerKey.allows(key),
                )[0];
                if (matchingKey) {
                    type = matchingKey[1];
                }
            }
        }

        if (!type) {
            throw new Error(
                `Property ${key.toString()} not found and no catchall type provided.`,
            );
        }

        return type;
    }

    public async unknownSetProperty(
        key: string | symbol,
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- The redundant type here offers documentation for developers
        value: unknown | UnknownModel,
    ): Promise<this> {
        const schema = this.schemaForKey(key);

        const existing = this.unknownGetProperty(key);

        const adopted = await validateAndMakeModel(
            value,
            schema,
            existing?.valueModel
                .parentInfo /* keep the existing parentInfo if possible */ ?? {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { property: key, type: 'property' },
            },
        );

        const copy = {
            ...(this.value as UnknownRecord),
        };
        (copy as UnknownRecord)[key] = adopted.value;

        await validateAndThrow(this.type, copy, { deep: true });

        const propertyModels: KnownPropertyModels = {
            ...this.#properties,
            [key]: {
                name: key,
                isOptional: schema.meta.optional ?? false,
                valueModel: adopted,
            },
        };
        const result = new ObjectImpl<TObjectSchema>(
            copy as never,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async setProperty<
        TKey extends keyof type.infer<TObjectSchema> & (string | symbol)
    >(
        key: TKey,
        /* @ts-expect-error -- Typescript can't confirm that Type<TValue> is a Type (it might be never) */
         
        value: type.infer<TObjectSchema>[Key] | ValueModelForProperty<TObjectSchema, Key>,
    ): Promise<this> {
        return this.unknownSetProperty(key, value);
    }

    public unknownGetProperty(
        key: string | symbol,
    ): UnknownPropertyModel | undefined {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.#properties, key)) {
            const result = this.#properties[key];
            return result;
        }

        return undefined;
    }

    public getProperty<
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TObjectSchema> &
            string,
    >(key: TKey): TypedPropertyModelForKey<TObjectSchema, TKey> {
        return this.unknownGetProperty(key) as TypedPropertyModelForKey<
            TObjectSchema,
            TKey
        >;
    }

    public async moveProperty(
        from: string | symbol,
        to: string | symbol,
        validate: boolean = true,
    ): Promise<this> {
        const typeInfo = getObjectTypeInfo(this.type);
        const fixedProps = typeInfo.getFixedProperties();

        if (fixedProps.has(from)) {
            throw new Error(
                `Cannot delete a known property '${from.toString()}'.`,
            );
        }
        if (fixedProps.has(to)) {
            throw new Error(`Cannot add a known property '${to.toString()}'.`);
        }

        const copy: UnknownRecord = {
            ...(this.value as UnknownRecord),
            [to]: (this.value as UnknownRecord)[from]!,
        };
        delete copy[from];

        if (validate) {
            await validateAndThrow(this.type, copy, { deep: true });
        }

        const propertyModels: KnownPropertyModels = {
            ...this.#properties,
            [to]: this.#properties[from]!,
        };
        delete propertyModels[from];

        const result = new ObjectImpl<TObjectSchema>(
            copy as never,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async deleteProperty(
        key: string | symbol,
        validate: boolean = true,
    ): Promise<this> {
        const typeInfo = getObjectTypeInfo(this.type);
        const fixedProps = typeInfo.getFixedProperties();

        if (fixedProps.has(key)) {
            throw new Error(
                `Cannot delete a known property '${key.toString()}'.`,
            );
        }

        const copy = {
            ...(this.value as UnknownRecord),
        };
        delete copy[key];

        if (validate) {
            await validateAndThrow(this.type, copy, { deep: false });
        }

        const propertyModels = {
            ...this.#properties,
        };
        delete propertyModels[key];

        const result = new ObjectImpl<TObjectSchema>(
            copy as never,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public unknownGetProperties(
        filter?: ObjectPropertyType,
    ): readonly UnknownPropertyModel[] {
        if (filter) {
            const typeInfo = getObjectTypeInfo(this.type);
            const fixedProps = typeInfo.getFixedProperties();

            const callback: (prop: UnknownPropertyModel) => boolean =
                filter === 'fixed'
                    ? (prop) => fixedProps.has(prop.name)
                    : (prop) => !fixedProps.has(prop.name);

            return Object.values(this.#properties)
                .filter(callback)
                .sort((a, b) => defaultSort(a.name, b.name));
        } else {
            // Unfiltered
            return Object.values(this.#properties).sort((a, b) =>
                defaultSort(a.name, b.name),
            );
        }
    }

    public getProperties(
        filter?: ObjectPropertyType,
    ): readonly PropertyModelNoConstraint<
        arkTypeUtilityTypes.AllPropertyArkTypes<TObjectSchema>
    >[] {
        return this.unknownGetProperties(filter) as never;
    }
}

function defaultSort<T>(a: T, b: T) {
    return a > b ? -1 : Object.is(a, b) ? 0 : 1;
}
