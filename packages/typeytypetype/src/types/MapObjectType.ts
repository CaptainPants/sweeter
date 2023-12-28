import { descend } from '@captainpants/sweeter-utilities';
import { ObjectType } from './ObjectType.js';
import { PropertyDefinition } from './PropertyDefinition.js';
import { type Type } from './Type.js';

export class MapObjectType<TValue> extends ObjectType<Record<string, TValue>> {
    public constructor(entryDefinition: Type<TValue>) {
        super();
        this.entryDefinition = new PropertyDefinition(entryDefinition);
    }

    public readonly entryDefinition: PropertyDefinition<TValue>;

    public override doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is Record<string, TValue> {
        if (typeof value !== 'object' || value === null) return false;

        if (!deep) {
            return true;
        }

        const asRecord = value as Record<string, unknown>;

        // Looking for validation failures
        const inputPropertyFailures = Object.keys(value).findIndex((key) => {
            const property = (value as Record<string, unknown>)[key];
            if (typeof property === 'undefined') return true; // this shouldn't happen

            const propertyValue = asRecord[key];
            if (
                !this.entryDefinition.type.doMatches(
                    propertyValue,
                    deep,
                    descend(depth),
                )
            ) {
                return true;
            }

            return false;
        });

        return inputPropertyFailures < 0;
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return `Record<string, ${this.entryDefinition.type.toTypeString(
            descend(depth),
        )}>`;
    }

    public override staticGetPropertyDefinition<Key extends string>(
        key: Key,
    ): PropertyDefinition<TValue> | null {
        return this.entryDefinition;
    }

    public override getExpandoType(): Type<TValue> | undefined {
        return this.entryDefinition.type;
    }

    public override doCreateDefault(depth: number): Record<string, TValue> {
        // Create without a prototype
        // This would be ideal for all instances we're looking at (for safety)
        // but impractical as it would require us to copy all our model objects
        return {};
    }
}
