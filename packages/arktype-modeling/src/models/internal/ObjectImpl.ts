
import { descend, hasOwnProperty } from '@captainpants/sweeter-utilities';

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
import {
    PropertyModel,
    type UnknownPropertyModel,
} from '../PropertyModel.js';
import { AnyTypeConstraint } from '../../type/AnyTypeConstraint.js';
import { Type, type } from 'arktype';
import { AnyObjectTypeConstraint } from '../../type/AnyObjectTypeConstraint.js';
import { getObjectTypeInfo } from '../../type/introspect/getObjectTypeInfo.js';

type UnknownRecord = Record<string | symbol, unknown>;
type KnownPropertyModels = {
    [key: string]: UnknownPropertyModel;
}


export class ObjectImpl<TObjectArkType extends AnyObjectTypeConstraint>
    extends ModelImpl<type.infer<TObjectArkType>, TObjectArkType>
    implements ObjectModel<TObjectArkType>
{
    public static createFromValue<TObjectArkType extends AnyObjectTypeConstraint>(
        value: type.infer<TObjectArkType>,
        schema: TObjectArkType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ObjectImpl<TObjectArkType> {
        const propertyModels: KnownPropertyModels = {};

        // Object.keys lets us avoid prototype pollution
        for (const prop of schema.props) {
            const propertyValue = (value as UnknownRecord)[prop.key];

            const propertyName = prop.key;

            const propertyType = prop.value;

            // TODO: this should potentially unwrap out ZodOptional
            const propertyValueModel = ModelFactory.createUnvalidatedModelPart({
                value: propertyValue,
                arkType: propertyType,
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

    public unknownGetCatchallType(): AnyTypeConstraint | undefined {
        return getObjectTypeInfo(this.type).stringMappingType;
    }

    public getCatchallType(): arkTypeUtilityTypes.CatchallPropertyValueArkType<TObjectArkType> {
        return getObjectTypeInfo(this.type).stringMappingType as never;
    }

    private typeForKey(key: string) {
        const info = getObjectTypeInfo(this.type);
    
        const type: AnyTypeConstraint | undefined = info.fixedProps.get(key) ?? info.stringMappingType;

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
            arkType: type,
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
                valueModel: adopted
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
        TKey extends keyof type.infer<TObjectArkType> & string,
        TValue extends type.infer<TObjectArkType>[TKey],
    >(
        key: TKey,
        /* @ts-expect-error */
        value: TValue | Model<Type<TValue>>,
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
        TKey extends arkTypeUtilityTypes.AllPropertyKeys<TObjectArkType> & string,
    >(key: TKey): TypedPropertyModelForKey<TObjectArkType, TKey> {
        return this.unknownGetProperty(key) as TypedPropertyModelForKey<
            TObjectArkType,
            TKey
        >;
    }

    public async moveProperty(
        from: string,
        to: string,
        validate: boolean = true,
    ): Promise<this> {
        const typeInfo = getObjectTypeInfo(this.type);

        if (hasOwnProperty(typeInfo.fixedProps, from)) {
            throw new Error(`Cannot delete a known property '${from}'.`);
        }
        if (hasOwnProperty(typeInfo.fixedProps, to)) {
            throw new Error(`Cannot add a known property '${to}'.`);
        }

        const copy = {
            ...(this.value as UnknownRecord),
            [to]: (this.value as UnknownRecord)[from]!,
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

        const result = new ObjectImpl<TObjectArkType>(
            copy as never,
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
        const typeInfo = getObjectTypeInfo(this.type);

        if (hasOwnProperty(typeInfo.fixedProps, key)) {
            throw new Error(`Cannot delete a known property '${key}'.`);
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