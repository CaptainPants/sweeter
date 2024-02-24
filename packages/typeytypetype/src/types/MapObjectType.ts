import { descend } from '@captainpants/sweeter-utilities';
import { type Type } from './Type.js';
import { BaseType } from './BaseType.js';

export interface UnknownMapObjectType extends Type<Record<string, unknown>> {
    getExpandoType(): Type<unknown> | undefined;
}

export class MapObjectType<TValue> extends BaseType<Record<string, TValue>> {
    public constructor(itemType: Type<TValue>) {
        super();
        this.itemType = itemType;
    }

    public readonly itemType: Type<TValue>;

    public doMatches(
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
            if (!this.itemType.doMatches(propertyValue, deep, descend(depth))) {
                return true;
            }

            return false;
        });

        return inputPropertyFailures < 0;
    }

    public toTypeString(depth: number = descend.defaultDepth): string {
        return `Record<string, ${this.itemType.toTypeString(descend(depth))}>`;
    }
    public getExpandoType(): Type<TValue> | undefined {
        return this.itemType;
    }

    public override doCreateDefault(depth: number): Record<string, TValue> {
        // Create without a prototype
        // This would be ideal for all instances we're looking at (for safety)
        // but impractical as it would require us to copy all our model objects
        return {};
    }
}
