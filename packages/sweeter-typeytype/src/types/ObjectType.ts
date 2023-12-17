import { combineTypeDefinitionPath } from '../internal/combineTypeDefinitionPath.js';
import { type GetExpandoType } from '../internal/utilityTypes.js';
import { descend } from '../utility/descend.js';
import {
    type ValidationOptions,
    type ValidationSingleResult,
} from '../validation/types.js';

import { BaseType } from './BaseType.js';
import { type PropertyDefinition } from './PropertyDefinition.js';
import { type Type } from './Type.js';

export abstract class ObjectType<
    TObject extends Record<string, unknown>,
> extends BaseType<TObject> {
    public getFixedPropertyNames(): string[] {
        return [];
    }

    public abstract staticGetPropertyDefinition<Key extends string>(
        key: Key,
    ): PropertyDefinition<TObject[Key]> | null;

    public getExpandoType(): Type<GetExpandoType<TObject>> | undefined {
        return undefined;
    }

    public supportsDelete(): boolean {
        return false;
    }

    protected override async validateChildren(
        value: TObject,
        options: ValidationOptions,
        depth: number,
    ): Promise<ValidationSingleResult[] | undefined> {
        const keys = Object.keys(value);

        const res: ValidationSingleResult[] = [];

        for (const key of keys) {
            const propValue = value[key];
            const propDefinition = this.staticGetPropertyDefinition(key);

            const currentPropValidationResult =
                await propDefinition?.type.validate(
                    propValue,
                    options,
                    descend(depth),
                );

            if (
                currentPropValidationResult !== undefined &&
                !currentPropValidationResult.success
            ) {
                res.push(
                    ...currentPropValidationResult.error.map((item) => ({
                        path: combineTypeDefinitionPath(key, item.idPath),
                        message: item.message,
                    })),
                );
            }
        }

        return res;
    }
}
