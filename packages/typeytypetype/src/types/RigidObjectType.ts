import { descend } from '../utility/descend.js';
import { hasOwnProperty } from '../utility/hasOwnProperty.js';
import { assertNotNullOrUndefined } from '../utility/index.js';

import { type PropertyDefinitions } from './internal/types.js';
import { ObjectType } from './ObjectType.js';
import { type PropertyDefinition } from './PropertyDefinition.js';

export class RigidObjectType<
    TObject extends Record<string, unknown>,
> extends ObjectType<TObject> {
    public constructor(propertyDefinitions: PropertyDefinitions<TObject>) {
        super();
        this.propertyDefinitions = propertyDefinitions;
    }

    public readonly propertyDefinitions: PropertyDefinitions<TObject>;

    public override doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is TObject {
        if (typeof value !== 'object' || value === null) return false;

        if (!deep) {
            return true;
        }

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const fixedPropertiesFailureIndex = Object.keys(
            this.propertyDefinitions,
        ).findIndex((key) => {
            const property = this.propertyDefinitions[key];

            // We are allowed to have values that don't have a matching definition
            // this is to allow { a: number } to match { a: number, other: string }
            // which is a common requirement.
            // We might consider at a late introducing a 'strict' mode.
            if (typeof property !== 'undefined') {
                const propertyValue = asRecord[key];
                if (
                    !property.type.doMatches(
                        propertyValue,
                        deep,
                        descend(depth),
                    )
                ) {
                    // Found an error
                    return true;
                }
            }

            // False means keep looking
            return false;
        });

        return fixedPropertiesFailureIndex < 0;
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return (
            '{\r\n' +
            Object.entries(this.propertyDefinitions)
                .map(
                    ([key, prop]: [string, PropertyDefinition<unknown>]) =>
                        `    ${JSON.stringify(key)}: ${prop.type.toTypeString(
                            descend(depth),
                        )};\r\n`,
                )
                .join('') +
            '}'
        );
    }

    public override getFixedPropertyNames(): string[] {
        return Object.keys(this.propertyDefinitions);
    }

    public override staticGetPropertyDefinition<Key extends string>(
        key: Key,
    ): PropertyDefinition<TObject[Key]> | null {
        // Avoid prototype properties being treated as valid (E.g. 'toString')
        if (hasOwnProperty(this.propertyDefinitions, key)) {
            const propertyDef = this.propertyDefinitions[key];
            return propertyDef;
        }
        return null;
    }

    public override doCreateDefault(depth: number): TObject {
        const res: Record<string, unknown> = {};
        // Object.keys avoids prototype polution
        for (const propName of Object.keys(this.propertyDefinitions)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const prop = this.propertyDefinitions[propName];

            assertNotNullOrUndefined(prop);

            res[propName] = prop.type.createDefault(descend(depth));
        }
        return res as TObject;
    }
}
