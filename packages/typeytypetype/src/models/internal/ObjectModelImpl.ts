import { descend, hasOwnProperty } from '@captainpants/sweeter-utilities';
import { type GetExpandoType } from '../../internal/utilityTypes.js';
import { type ObjectType } from '../../types/ObjectType.js';
import { PropertyDefinition } from '../../types/PropertyDefinition.js';
import { type Type } from '../../types/Type.js';
import { Types } from '../../types/Types.js';
import { type ObjectModel, type PropertyModelFor } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';
import { type PropertyModel } from '../PropertyModel.js';

import { ModelImpl } from './ModelImpl.js';
import { PropertyModelImpl } from './PropertyModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';

export class ObjectModelImpl<TObject extends Record<string, unknown>>
    extends ModelImpl<TObject, ObjectType<TObject>>
    implements ObjectModel<TObject>
{
    public static createFromValue<TObject extends Record<string, unknown>>(
        value: TObject,
        type: ObjectType<TObject>,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ObjectModelImpl<TObject> {
        const propertyModels: Record<string, PropertyModel<unknown>> = {};

        // Object.keys lets us avoid prototype pollution
        for (const name of Object.keys(value)) {
            // If there is no matching property we treated it as unknown
            // This is basically to support using an object def like { a: number } to match { a: number, other: string }
            const propertyDef =
                type.staticGetPropertyDefinition(name) ??
                new PropertyDefinition(Types.unknown());

            const propertyValueModel = ModelFactory.createUnvalidatedModelPart({
                value: value[name],
                type: propertyDef.type,
                parentInfo: {
                    relationship: { type: 'property', property: name },
                    type,
                    parentInfo,
                },
                depth: descend(depth),
            });

            propertyModels[name] = new PropertyModelImpl<unknown>(
                name,
                propertyDef,
                propertyValueModel,
            );
        }

        return new ObjectModelImpl<TObject>(
            value,
            propertyModels,
            type,
            parentInfo,
        );
    }

    public constructor(
        value: TObject,
        propertyModels: Record<string, PropertyModel<unknown>>,
        type: ObjectType<TObject>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'object');

        this.#propertyModels = propertyModels;
    }

    #propertyModels: Record<string, PropertyModel<unknown>>;

    public getExpandoPropertyType(): Type<GetExpandoType<TObject>> | undefined {
        return this.getExpandoPropertyType();
    }

    public getPropertyModel<TKey extends keyof TObject & string>(
        key: TKey,
    ): PropertyModelFor<TObject, TKey> {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.#propertyModels, key)) {
            const result = this.#propertyModels[key];
            return result as PropertyModelFor<TObject, TKey>;
        }
        // This is a bit filthy but we want to support Record<string, unknown> indexing
        // on properties that are not set
        return undefined as PropertyModelFor<TObject, TKey>;
    }

    public getProperties(): Array<PropertyModel<unknown>> {
        return Object.values(this.#propertyModels);
    }

    public async setPropertyValue(
        key: string,
        value: unknown,
        validate: boolean = true,
    ): Promise<this> {
        const def = this.type.staticGetPropertyDefinition(key);

        if (def === null) {
            throw new TypeError(
                `Could not assign to property ${key} as no type found.`,
            );
        }

        const adopted = await validateAndMakeModel(
            value,
            def.type,
            {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { property: key, type: 'property' },
            },
            validate,
        );

        const copy = {
            ...this.value,
            [key]: adopted.value,
        };

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const propertyModels = {
            ...this.#propertyModels,
            [key]: new PropertyModelImpl(
                key,
                def,
                adopted,
            ) as PropertyModel<unknown>,
        };
        const result = new ObjectModelImpl<TObject>(
            copy as TObject,
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
        if (!this.type.supportsDelete()) {
            throw new TypeError('Delete not supported.');
        }

        const copy = { ...this.value };

        delete copy[key];

        if (validate) {
            await this.type.validateAndThrow(copy, { deep: false });
        }

        const propertyModels = { ...this.#propertyModels };

        delete propertyModels[key];

        const result = new ObjectModelImpl<TObject>(
            copy,
            propertyModels,
            this.type,
            this.parentInfo,
        );

        return result as this;
    }
}
