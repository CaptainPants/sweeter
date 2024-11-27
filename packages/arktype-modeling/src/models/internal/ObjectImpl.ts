import {
    descend,
    hasOwnProperty,
    throwError,
} from '@captainpants/sweeter-utilities';

import {
    type ObjectModel,
    type Model,
    type TypedPropertyModelForKey,
    PropertyModelNoConstraint,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { validateAndThrow } from '../../utility/validate.js';
import { type UnknownPropertyModel } from '../PropertyModel.js';
import {
    AnyObjectTypeConstraint,
    AnyTypeConstraint,
    UnknownType,
} from '../../type/types.js';
import { Type, type } from 'arktype';
import { getObjectTypeInfo } from '../../type/introspect/getObjectTypeInfo.js';
import { introspect } from '../../type/index.js';

type UnknownRecord = Record<string | symbol, unknown>;
type KnownPropertyModels = {
    [key: string | symbol]: UnknownPropertyModel;
};

export class ObjectImpl<TObjectArkType extends AnyObjectTypeConstraint>
    extends ModelImpl<type.infer<TObjectArkType>, TObjectArkType>
    implements ObjectModel<TObjectArkType>
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

        // Object.keys lets us avoid prototype pollution
        for (const [propertyName, propertyType] of typeInfo.getProperties()) {
            const propertyValue = (value as UnknownRecord)[propertyName];

            // TODO: this should potentially unwrap out ZodOptional
            const propertyValueModel = ModelFactory.createUnvalidatedModelPart({
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

        return new ObjectImpl<TObjectArkType>(
            value,
            propertyModels,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: type.infer<TObjectArkType>,
        properties: KnownPropertyModels,
        type: TObjectArkType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');

        this.#properties = properties;
    }

    #properties: KnownPropertyModels;

    public unknownGetCatchallType(): UnknownType | undefined {
        throw new Error('TODO: CATCH ALL');
        // return getObjectTypeInfo(this.type).stringMappingType;
    }

    public getCatchallType(): arkTypeUtilityTypes.CatchallPropertyValueArkType<TObjectArkType> {
        throw new Error('TODO: CATCH ALL');
        // return getObjectTypeInfo(this.type).stringMappingType as never;
    }

    private typeForKey(key: string | symbol) {
        const info = getObjectTypeInfo(this.type);
        const fixedProps = info.getProperties();

        const type: AnyTypeConstraint | undefined =
            fixedProps.get(key) ?? throwError('TODO: ObjectImpl.typeForKey.1 -- mapped keys'); //?? info.stringMappingType;

        if (!type) {
            throw new Error(
                `Property ${key.toString()} not found and no catchall type provided.`,
            );
        }

        return type;
    }

    public async unknownSetProperty(
        key: string | symbol,
        value: unknown,
        validate: boolean = true,
    ): Promise<this> {
        const type = this.typeForKey(key);

        const adopted = ModelFactory.createUnvalidatedModelPart({
            value,
            schema: type,
            parentInfo: {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { property: key, type: 'property' },
            },
        });

        const copy = {
            ...(this.value as UnknownRecord),
        };
        (copy as UnknownRecord)[key] = adopted.value;

        if (validate) {
            await validateAndThrow(this.type, copy, { deep: true });
        }

        const propertyModels: KnownPropertyModels = {
            ...this.#properties,
            [key]: {
                name: key,
                isOptional: type.meta.optional ?? false,
                valueModel: adopted,
            },
        };
        const result = new ObjectImpl<TObjectArkType>(
            copy as never,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }

    public async setProperty<
        TKey extends keyof type.infer<TObjectArkType> & (string | symbol),
        TValue extends type.infer<TObjectArkType>[TKey],
    >(
        key: TKey,
        /* @ts-expect-error */
        value: TValue | Model<Type<TValue>>,
        validate: boolean = true,
    ): Promise<this> {
        return this.unknownSetProperty(key, value, validate);
    }

    public unknownGetProperty(key: string | symbol): UnknownPropertyModel | undefined {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.#properties, key)) {
            const result = this.#properties[key];
            return result;
        }

        return undefined;
    }

    public getProperty<
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TObjectArkType> &
            string,
    >(key: TKey): TypedPropertyModelForKey<TObjectArkType, TKey> {
        return this.unknownGetProperty(key) as TypedPropertyModelForKey<
            TObjectArkType,
            TKey
        >;
    }

    public async moveProperty(
        from: string | symbol,
        to: string | symbol,
        validate: boolean = true,
    ): Promise<this> {
        const typeInfo = getObjectTypeInfo(this.type);
        const fixedProps = typeInfo.getProperties();

        if (fixedProps.has(from)) {
            throw new Error(`Cannot delete a known property '${from.toString()}'.`);
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

        const result = new ObjectImpl<TObjectArkType>(
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
        const fixedProps = typeInfo.getProperties();

        if (fixedProps.has(key)) {
            throw new Error(`Cannot delete a known property '${key.toString()}'.`);
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

        const result = new ObjectImpl<TObjectArkType>(
            copy as never,
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

    public getProperties(): readonly PropertyModelNoConstraint<
        arkTypeUtilityTypes.AllPropertyArkTypes<TObjectArkType>
    >[] {
        return Object.values(this.#properties).sort((a, b) =>
            defaultSort(a.name, b.name),
        ) as never;
    }
}

function defaultSort<T>(a: T, b: T) {
    return a > b ? -1 : Object.is(a, b) ? 0 : 1;
}
